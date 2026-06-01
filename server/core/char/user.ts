/**
 * USER 玩家类
 */
import { CHARACTER } from './character.js';
import { ROOM } from '../room/room.js';
import { OBJ } from '../item/obj.js';
import type { EQUIPMENT } from '../item/equipment.js';
import { CORPSE } from '../item/corpse.js';
import { SKILL } from '../skill/skill.js';
import type { FAMILY } from '../skill/family.js';
import type { AREA } from '../room/area.js';
import { FOLLOWER } from './follower.js';
import { WORLD } from '../world.js';
import { UTIL } from '../util.js';
import { WEAPON_TYPE } from '../const.js';
import type { GameSocket } from '../../types/world.js';
import type { NPC } from './npc.js';
import { FAMILIES } from '../skill/family.js';

// ============================================================
// 模块级常量
// ============================================================

/** 默认出生房间 */
const DEFAULT_ROOM = 'yz/wumiao';

/** 需要保存的数值属性列表 */
const SAVE_NUMPROP = [
  'str', 'con', 'dex', 'int', 'gender', 'max_mp', 'limit_mp', 'exp', 'pot',
  'kar', 'per', 'hp', 'mp', 'max_item_count', 'money', 'reg_time',
  'max_store_count', 'cash_money', 'eq_group',
];

/** 等级称号 */
const LEVELS_TITLES = ['普通百姓', '武士', '武师', '宗师', '武圣', '武帝', '武神'];

/** 各等级精力上限 */
const jclimits = [1000, 2000, 3000, 5000, 7000, 10000, 15000];

/** 死亡消息模板 */
const DIE_MSG = [
  '\n$N扑在地上挣扎了几下，腿一伸，口中喷出几口<HIR>鲜血</HIR>，死了！\n',
  '\n$N大叫一声倒在地上，挣扎了几下，<HIR>死了</HIR>！\n',
  '\n$N口中喷出几口<HIR>鲜血</HIR>，倒在地上,死了！\n',
];

// ============================================================
// 类型定义
// ============================================================

/** 数据库角色记录格式 */
interface RoleRecord {
  /** 角色 ID */
  id: string;
  /** 角色名称 */
  name: string;
  /** 角色等级 */
  level: number;
  /** 序列化后的完整角色数据 */
  data: string;
  /** 用户权限等级 */
  user_level: number;
}

/** 玩家状态对象（打坐/练功/闭关等） */
interface UserState {
  /** 状态标题（如 "打坐中"） */
  title: string;
  /** 状态触发频率（心跳次数） */
  rate?: number;
  /** 心跳累计计数 */
  heat_count?: number;
  /** 状态开始时间戳 */
  start_time?: number;
  /** 状态描述 */
  desc?: string;
  /** 是否禁止手动停止 */
  no_stop?: boolean;
  /** 自定义命令 JSON */
  commands?: string;
  /** 是否允许战斗中执行 */
  allow_fight?: boolean;
  /** 状态进入回调，dt 为当前时间戳，返回 false 则自动停止 */
  on_enter?: (me: CHARACTER, dt?: number) => boolean | void;
  /** 状态停止回调，isauto 表示是否自动停止 */
  on_stop?: (me: CHARACTER, isauto?: boolean) => boolean | void;
}

/** 称号条目 */
interface TitleEntry {
  /** 称号文本 */
  title: string;
  /** 称号类型 */
  type: string;
  /** 是否正在使用 */
  use: boolean;
}

/** 随从描述 */
interface FollowerDesc {
  /** 随从 ID */
  id: string;
  /** 随从模板路径 */
  path: string;
}

// ============================================================
// USER 类
// ============================================================

export class USER extends CHARACTER {
  // ============ 玩家标识 ============

  /** 是否为玩家 */
  is_player: boolean = true;
  /** 玩家数据库ID(角色ID) */
  id!: string;
  /** 账号ID */
  userid!: number;
  /** 角色名称(覆盖父类) */
  name!: string;
  /** 角色等级 */
  level: number = 0;
  /** 所属门派 */
  family: FAMILY = FAMILIES.NONE;

  // ============ 网络连接 ============

  /** 网络套接字 */
  socket?: GameSocket;
  /** IP地址 */
  ip_address: string;
  /** 登录密码 */
  password: string = '';
  /** 登录时间戳 */
  loginTime: number = 0;
  /** 所在服务器ID */
  serverid: number = 0;
  /** 请求计数(频率限制) */
  request_count: number = 0;
  /** 等待用户输入的回调 */
  wait_input: ((me: CHARACTER, req: string) => void) | null = null;
  /** 向玩家发送选择题（由 world/cmd/action/answer.js 注入 USER.prototype） */
  send_question?(npc: any, list: any[], callbacks: any[]): void;

  // ============ 权限与状态 ============

  /** 用户权限等级 0=普通 6=管理员 */
  user_level: number = 0;
  /** 是否静默消息 */
  no_message: boolean = false;
  /** 登录提示消息缓存 */
  login_message: string | null = null;
  /** 断线时间戳 */
  disconnect_time: number = 0;

  // ============ 物品与装备 ============

  /** 最大背包容量 */
  max_item_count: number = 20;
  /** 最大仓库容量 */
  max_store_count: number = 20;
  /** 金钱 */
  money: number = 0;
  /** 元宝(充值货币) */
  cash_money: number = 0;
  /** 背包物品 */
  items: OBJ[] | null = null;
  /** 仓库物品 */
  stores: OBJ[] | null = null;
  /** 装备列表 */
  equipment: EQUIPMENT[] | null = null;
  /** 当前装备组 */
  eq_group: number = 0;
  /** 装备组定义 */
  eq_groups: string[][] | null = null;

  // ============ 技能 ============

  /** 技能组定义 */
  sk_groups?: (string[] | null)[];
  /** 秘籍列表 */
  books: string[] = [];

  // ============ 社交与随从 ============

  /** 随从描述列表 */
  follower: FollowerDesc[] | null = null;

  // ============ 设置与数据 ============

  /** 用户设置 */
  settings: Record<string, number> | null = null;
  /** 临时数据 */
  temp: Record<string, any> | null = null;
  /** 称号列表 */
  titles: TitleEntry[] | null = null;
  /** 离线前所在房间路径 */
  quit_room: string | null = null;
  /** 阅历积分 */
  score: number = 0;
  /** 禁止战斗标识 */
  no_fight: boolean = false;
  /** 记录伤害标识 */
  record_damage: boolean = false;
  /** 屏蔽战斗消息标识 */
  no_combatmsg: boolean = false;
  /** 命令JSON缓存 */
  commands_json: string | null = null;

  // ============ 消息发送 ============

  /**
   * 通知消息(玩家状态)
   */
  notify(text: string): void {
    if (this.socket && this.socket.send && !this.is_faint && text && text.length < 30240) {
      this.socket.send(text);
    }
  }

  /**
   * 直接发送消息(无视状态)
   */
  send(text: string): void {
    if (this.socket && text && text.length < 30240) {
      this.socket.send?.(text);
    }
  }

  /**
   * 发送失败通知
   * @returns boolean 是否发送成功(总是返回false，方便调用时直接return)
   */
  notify_fail(text: string): boolean {
    if (this.socket && this.socket.send && !this.is_faint) {
      this.socket.send(text);
    }
    return false;
  }

  /**
   * 发送警告消息
   */
  send_warn(content: string, cmds: string[], time?: number): void {
    const str: string[] = ['{type:"warn",content:"'];
    str.push(content);
    str.push('"');
    if (time) {
      str.push(',time:');
      str.push(time.toString());
    }
    str.push(',cmds:[');
    for (let i = 0; i < cmds.length; i += 2) {
      if (i > 0) str.push(',');
      str.push('{cmd:"');
      str.push(cmds[i]);
      str.push('",name:"');
      str.push(cmds[i + 1]);
      str.push('"}');
    }
    str.push(']}');
    this.send(str.join(''));
  }

  /**
   * 发送命令按钮列表
   */
  send_commands(...args: string[]): void {
    const str: string[] = ['{type:"cmds",items:['];
    for (let i = 0; i < args.length; i += 2) {
      if (i > 0) str.push(',');
      str.push('{cmd:"');
      str.push(args[i]);
      str.push('",name:"');
      str.push(args[i + 1]);
      str.push('"}');
    }
    str.push(']}');
    this.send(str.join(''));
  }

  /**
   * 是否有Socket连接
   */
  is_connect(): boolean {
    return this.socket !== null;
  }

  /** 发送登录初始化消息 */
  send_loginmessage(): void {
    if (!this.login_message) {
      const str: string[] = ['{type:"login"'];
      if (this.settings) {
        str.push(',setting:');
        str.push(JSON.stringify(this.settings));
        this.no_message = this.settings['no_message'] == 1;
      }
      str.push(',id:"');
      str.push(this.id, '",name:"', this.name, '",level:', this.level.toString());
      str.push('}');
      this.login_message = str.join('');
    }

    this.send(this.login_message);
  }

  /**
   * 重新连线(账号被顶替后重连)
   */
  relogin(newUser: USER): void {
    if (!newUser.socket) return;
    (newUser.socket as { user: USER | null }).user = null;
    this.socket = newUser.socket;
    newUser.socket = undefined;
    this.socket.user = this;
    this.send_loginmessage();

    if (!this.environment) {
      const rm = ROOM.Get(this.quit_room!);
      if (!rm) {
        this.send('出现错误，请联系管理员报告BUG，谢谢！');
        return;
      }
      this.environment = rm;
    }
    this.send((this.environment as ROOM).to_json());
    (this.environment as ROOM).send_exits(this);
    this.send((this.environment as ROOM).items_to_json());
    this.send_room(this.name + '重新连线。');
    if ((this.environment as ROOM & { on_relogin?: (me: USER) => void }).on_relogin) {
      (this.environment as ROOM & { on_relogin?: (me: USER) => void }).on_relogin!(this);
    }
    this.disconnect_time = 0;
    this.check_state();
    this.on_skillchanged();
  }

  /**
   * 获取IP地址
   */
  ip(): string {
    return this.socket?.remoteAddress ?? '';
  }

  /**
   * 获取端口
   */
  port(): number {
    return this.socket?.remotePort ?? 0;
  }

  /** 退出游戏 */
  quit(): void {
    const rm = this.environment;
    if (this.environment) {
      this.team_out('离开了游戏，自动退出队伍');
      this.environment.item_changed(this, false, this.name + '离开了游戏。');
      this.environment = rm;
      this.clear_follow();
      (this.environment as ROOM).clear_copy(this);
      (this.environment as ROOM).parent?.on_leaved?.(this);
    }
    this.environment = undefined;
    this.clear_status();
    this.environment = rm;
    WORLD.login_out(this);
    this.environment = undefined;

    this.clear_home();
    if (this.socket) {
      (this.socket as { user: USER | null }).user = null;
      this.socket = undefined;
    }
  }

  /**
   * 判断是否已进入游戏世界
   */
  in_world(): boolean {
    return !!this.environment && !!this.socket;
  }

  /**
   * 断线处理
   */
  disconnect(isreplace?: boolean): void {
    if (this.environment && this.socket) {
      if (isreplace) {
        this.send('<RED>有人使用你的角色从别的地址登陆游戏，请重新登陆</RED>');
      }
    }
    this.disconnect_time = Date.now();
    if (this.socket) {
      const socket = this.socket;
      this.socket = undefined;
      (socket as { user: USER | null }).user = null;
      socket.end();
    }
  }

  // ============ 数据加载与保存 ============

  /**
   * 从数据库记录加载用户数据
   */
  loadData(role: RoleRecord): void {
    this.id = role.id;
    this.name = role.name;
    this.level = role.level;
    const data: any = JSON.toObject(role.data);
    for (let i = 0; i < SAVE_NUMPROP.length; i++) {
      (this as Record<string, any>)[SAVE_NUMPROP[i]] = data.prop[i] || 0;
    }
    this.quit_room = data.quit_room;
    this.items = this.read_items(data.items);
    this.stores = this.read_items(data.stores);
    this.books = data.books ?? [];
    this.equipment = this.read_equipment(data.eq);
    this.settings = data.settings;

    this.skills = data.skills ?? {};
    this.eq_groups = data.eq_groups;
    this.sk_groups = data.sk_groups ?? [null, [], []];
    this.temp = data.temp;
    this.read_titles(data.titles);
    if (data.follower) {
      this.follower = [];
      FOLLOWER.INIT_FROM_USER(this, data.follower);
      for (let i = 0; i < data.follower.length; i++) {
        (this.follower as FollowerDesc[]).push({
          id: data.follower[i].id,
          path: data.follower[i].path,
        });
      }
    }
    const fam: any = this.query_temp('family');
    if (fam) {
      this.family = (FAMILIES as Record<string, FAMILY>)[fam] || FAMILIES.NONE;
    }
    this.user_level = role.user_level;
  }

  /**
   * 读取称号数据
   */
  read_titles(titles: [string, string, number][] | undefined): void {
    this.titles = [];
    if (!titles) return;
    for (const item of titles) {
      (this.titles as TitleEntry[]).push({
        title: item[0],
        type: item[1],
        use: item[2] === 1,
      });
      if (item[2]) {
        this.title = item[0];
      }
    }
  }

  /**
   * 从数据库数组读取物品列表
   */
  read_items(items: any[][] | undefined): OBJ[] {
    const objs: OBJ[] = [];
    if (!items) return objs;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item) continue;
      const obj = OBJ.CREATE(item[0]);
      if (obj) {
        obj.load_db(item);
        obj.on_load(this);
        objs.push(obj);
      }
    }
    return objs;
  }

  read_equipment(items: any[][] | undefined): EQUIPMENT[] {
    const eqs: EQUIPMENT[] = [];
    if (!items) return eqs;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item) continue;
      const obj = OBJ.CREATE(item[0]) as EQUIPMENT | null;
      if (obj && obj.is_equipment) {
        obj.load_db(item);
        obj.on_load(this);
        eqs[obj.eq_type] = obj;
      }
    }
    return eqs;
  }

  /** 执行登录初始化 */
  do_login(): void {
    this.init();
    this.recount();
    this.long_name();
    WORLD.STATS.checkStats(this);
    this.send_loginmessage();
    if (this.family) this.family.on_login(this);
    let rm = ROOM.Get(this.query_temp('new') ? 'new/new1' : this.quit_room ?? DEFAULT_ROOM);
    if (!rm || rm.is_fb()) rm = ROOM.Get(DEFAULT_ROOM);
    if (rm!.is_copy()) {
      let copy_room = rm!.query_copy2(this);
      if (copy_room) {
        this.moveto(copy_room, "", this.name + '连线进入这个世界。');
      } else {
        if (this.query_temp('new')) {
          this.set_temp('new', 1);
          this.items = [];
          this.exp = this.pot = this.money = 0;
        }
        copy_room = rm!.create_copy2(this);
        this.moveto(copy_room);
      }
    } else {
      this.moveto(rm, "", this.name + '连线进入这个世界。');
    }
    this.check_state();
    if (this.follower && (!this.environment || (this.environment as ROOM).parent?.id !== 'home')) {
      const home = ROOM.Get('home/yuanzi');
      if (home) {
        let copy_home = home.query_copy2(this);
        if (!copy_home) copy_home = home.create_copy2(this);
        if (copy_home) {
          for (let i = 0; i < this.follower.length; i++) {
            const npc = FOLLOWER.STORES.get(this.id + '_' + this.follower[i].id);
            if (npc && !npc.environment) {
              if (!npc.hp) npc.hp = 1;
              if (npc.state) npc.set_state(null);
              npc.moveto(copy_home);
            }
          }
        }
      }
    }
  }

  /**
   * 获取玩家存档数据
   */
  getData(): Record<string, any> {
    const str: string[] = ['{prop:['];
    for (let i = 0; i < SAVE_NUMPROP.length; i++) {
      str.push(String((this as Record<string, any>)[SAVE_NUMPROP[i]]));
      str.push(',');
    }
    str.push('0');
    str.push('],quit_room:"');
    if (this.environment) {
      if (this.environment.is_fb() || (this.environment as ROOM & { no_save?: boolean }).no_save
        || (this.environment.parent as AREA & { no_save?: boolean }).no_save) {
        str.push(this.query_temp('enter_room') as string);
      } else {
        str.push((this.environment as ROOM).path);
      }
    } else {
      str.push(this.query_temp('enter_room', DEFAULT_ROOM) as string);
    }
    str.push('"');

    let items = this.items;
    if (items) {
      str.push(',items:[');
      for (let i = 0; i < items.length; i++) {
        if (i > 0) str.push(',');
        items[i].save_db(str);
      }
      str.push(']');
    }

    const stores = this.stores;
    if (stores) {
      str.push(',stores:[');
      for (let i = 0; i < stores.length; i++) {
        if (i > 0) str.push(',');
        stores[i].save_db(str);
      }
      str.push(']');
    }

    const books = this.books;
    if (books && books.length > 0) {
      str.push(',books:["', books.join('", "'), '"]');
    }
    if (this.skills) {
      str.push(',skills:');
      str.push(JSON.stringify(this.skills));
    }
    str.push(',temp:', this.format_temp(this.temp));
    if (this.settings) {
      str.push(',settings:');
      str.push(JSON.stringify(this.settings));
    }
    if (this.equipment) {
      str.push(',eq:[');
      for (let i = 0; i < this.equipment.length; i++) {
        if (i > 0) str.push(',');
        if (this.equipment[i]) this.equipment[i].save_db(str);
        else str.push('null');
      }
      str.push(']');
    }
    if (this.titles) {
      str.push(',titles:[');
      for (let i = 0; i < this.titles.length; i++) {
        if (i > 0) str.push(',');
        const item = this.titles[i];
        str.push('["', item.title, '","', item.type, '"');
        if (item.use) str.push(',1');
        str.push(']');
      }
      str.push(']');
    }
    if (this.follower) {
      str.push(',follower:');
      str.push(FOLLOWER.SAVE(this));
    }
    str.push(',eq_groups:[');
    const eqGroups = this.eq_groups;
    if (eqGroups) {
      for (let i = 0; i < eqGroups.length; i++) {
        if (i > 0) str.push(',');
        if (i === this.eq_group || !eqGroups[i]) str.push('[]');
        else str.push('["', eqGroups[i].join('","'), '"]');
      }
    }
    str.push('],sk_groups:[');
    const skGroups = this.sk_groups;
    if (skGroups) {
      for (let i = 0; i < skGroups.length; i++) {
        if (i > 0) str.push(',');
        const item = skGroups[i];
        if (!item) str.push('0');
        else str.push('["', item.join('","'), '"]');
      }
    }
    str.push(']}');

    const role: Record<string, any> = {};
    role.id = this.id;
    role.userid = this.userid;
    role.name = this.name;
    role.level = this.level;
    role.title = this.title || this.get_level_desc();
    role.data = str.join('');
    return role;
  }

  /** 保存玩家数据到数据库 */
  save(): void {
    WORLD.DB.saveRole(this.getData());
  }

  // ============ 死亡与状态 ============

  /**
   * 玩家死亡处理
   */
  die(killer: CHARACTER): boolean | undefined {
    if (this.on_die && this.on_die(killer) === false) {
      this.hp = 1;
      return false;
    }
    this.clear_status();

    this.hp = 0;
    this.mp = 0;

    this.send_room((DIE_MSG as any as string[]).random());
    const env = this.environment;
    if (env && env.items.length < 10) {
      const corpse = new CORPSE();
      corpse.init(this);
      env.item_changed(corpse, true);
    }
    if (env) env.item_changed(this, false);
    this.environment = env;
    this.check_state();
    WORLD.on_user_die(this, killer, undefined);
    this.on_died?.(killer, undefined);
  }

  /**
   * 检查并同步玩家状态到客户端
   */
  check_state(): void {
    if (this.hp <= 0) {
      if (this.state) this.set_state(null);
      this.send('{type:"die",commands:[{cmd:"relive",name:"去武庙复活"},{cmd:"relive locale",name:"原地复活"}]}');
    } else {
      if (this.state) this.set_state(this.state as UserState);
    }
  }

  // ============ 命令与查询 ============

  /**
   * 查询玩家操作命令列表(JSON)
   */
  query_commands(player: USER): string {
    if (this.commands_json) return this.commands_json;
    const json: Record<string, any> = {};
    json.type = 'item';
    json.desc = this.long_name();
    json.id = this.id;
    json.commands = [];
    json.commands.push({
      cmd: 'look ' + this.id,
      name: '查看',
    });
    if (player !== this) {
      if (!this.no_fight) {
        json.commands.push({
          cmd: 'fight ' + this.id,
          name: '比试',
        });
      }
      json.commands.push({
        cmd: 'kill ' + this.id,
        name: '击杀',
      });

      json.commands.push({
        cmd: 'team add ' + this.id,
        name: '邀请组队',
      });
      if (this.level > 1 && !this.query_setting('ban_master')
        && !this.query_temp('tudi') && !this.query_temp('shifu')) {
        json.commands.push({
          cmd: 'baishi ' + this.id,
          name: '拜师',
        });
      }
    }
    this.commands_json = JSON.stringify(json);
    return this.commands_json;
  }

  /**
   * 查询指定类型的称号
   */
  query_title(type: string): string | undefined {
    if (!this.titles) return undefined;
    for (let i = 0; i < this.titles.length; i++) {
      if (this.titles[i].type == type) {
        return this.titles[i].title;
      }
    }
    return undefined;
  }

  /**
   * 添加称号
   */
  add_title(title: string | null, type: string): void {
    if (!this.titles) this.titles = [];
    const obj  = { title, type, use: false };
    for (let i = 0; i < this.titles.length; i++) {
      if (this.titles[i].type == type) {
        obj.use = this.titles[i].use;
        this.titles.splice(i, 1);
        break;
      }
    }
    if (obj.title) {
      if (!this.titles.length) obj.use = true;
      this.titles.push(obj as TitleEntry);
    }
    if (obj.use) {
      if (!title) {
        if (this.titles.length) {
          this.titles[0].use = true;
          title = this.titles[0].title;
        }
      }
      this.title = title ?? undefined;
      this.color_name = '';
      if (this.environment) {
        this.environment.item_changed(this, true);
      }
    }
  }

  /**
   * 查询用户设置项
   */
  query_setting(name: string): number {
    if (!this.settings) return 0;
    return this.settings[name] || 0;
  }

  /**
   * 设置用户配置项
   */
  set_setting(name: string, value: string | number): void {
    if (!this.settings) this.settings = {};

    if (!value || value == '0') {
      delete this.settings[name];
    } else {
      if (value == '1') value = 1;
      this.settings[name] = value as number;
    }

    this.login_message = null;
  }

  // ============ 心跳与状态 ============

  /**
   * 玩家心跳处理
   */
  heart_beat(dt: number): void {
    this.request_count = 0;
    const st = this.state as UserState;
    if (st && (!this.fight_type || st.allow_fight)) {
      st.heat_count! += 1;
      if (st.heat_count! >= st.rate!) {
        st.heat_count = 0;
        if (st.on_enter?.(this, dt) === false) {
          this.set_state(null, true);
        }
      }
    }
    this.on_heart_beat?.(dt);
    if (this.disconnect_time) {
      if (dt - this.disconnect_time > (this.state ? 86400000 : 3600000)) {
        this.quit();
        return;
      }
    }
  }

  /**
   * 设置玩家状态(打坐/练功/闭关等)
   */
  set_state(state: UserState | null, isauto?: boolean): void {
    if (this.state && !state) {
      const oldState = this.state as UserState;
      if (oldState.on_stop) {
        if (oldState.on_stop(this, isauto) == false) {
          return;
        }
      }
      this.send('{type:"state"}');
    }
    this.state = state;
    if (state) {
      state.rate = state.rate || 1;
      state.heat_count = 0;
      state.start_time = Date.now();
      let msg = '{type:"state",state:"你正在' + state.title + '"';
      if (state.desc) {
        msg += ',desc:' + state.desc;
      }
      if (state.no_stop) {
        msg += ',no_stop:true';
      }
      if (state.commands) {
        msg += ',commands:' + state.commands;
      }
      this.send(msg + '}');
    }
    this.color_name = '';
    if (this.environment) {
      this.environment.item_changed(this, true);
    }
  }

  /**
   * 获取状态文本描述
   */
  get_state(): string {
    let str = '';
    if (!this.socket) str += '<red>&lt;断线中&gt;</red>';
    if (this.state) str += '<hig>&lt;' + (this.state as UserState).title + '&gt;</hig>';
    return str;
  }

  /**
   * 获取完整显示名称(含颜色)
   */
  long_name(): string {
    if (!this.color_name) {
      const cc = this.get_level_color();
      const str: string[] = [];
      if (cc) {
        str.push('<');
        str.push(cc);
        str.push('>');
      }
      if (this.title) {
        str.push(this.title);
        str.push(' ');
      }
      if (!this.title || this.level > 0) {
        str.push(LEVELS_TITLES[this.level]);
        str.push(' ');
      }
      str.push(this.name);
      if (cc) {
        str.push('</');
        str.push(cc);
        str.push('>');
      }
      this.color_name = str.join('');
      this.commands_json = null;
    }
    return this.color_name + this.get_state();
  }

  /** 初始化用户任务 */
  init_tasks(): void {
    for (let i = 0; i < WORLD.TASKS.length; i++) {
      const task = WORLD.TASKS[i];
      task.on_start?.(this);
    }
  }

  /**
   * 查询精力值
   */
  query_jingli(): number {
    const expend: number = (this.query_temp('ex_jl') as number) || 0;
    return 200 - expend + ((this.query_temp('ad_jl') as number) || 0);
  }

  /**
   * 查询当前等级的精力上限
   */
  query_jclimit(): number {
    return jclimits[this.level] || 1000;
  }

  // ============ 物品管理 ============

  /**
   * 添加物品到背包
   */
  add_obj(obj: OBJ | string, count?: number): OBJ | undefined {
    if (!obj) return;
    if (typeof obj === 'string') {
      obj = OBJ.clone_to(obj, this, count) as OBJ;
      if (!obj) return;
    } else {
      obj = this.push_item(obj) as OBJ;
    }

    this.items_changed(obj);

    obj.notify_action(this, true);
    return obj;
  }

  /**
   * 从背包移除物品
   */
  remove_obj(obj: OBJ | string, count?: number): OBJ | undefined {
    if (typeof obj === 'string') {
      obj = this.find_obj(obj) as OBJ;
    }
    if (!obj) return;
    count = count || obj.count || 1;
    const newobj = this.remove_item(obj, count) as OBJ;
    if (newobj == obj) {
      obj.notify_action(this, false);
    }
    this.items_changed(obj, count);
    return newobj;
  }

  /**
   * 物品变更通知客户端
   */
  items_changed(item: OBJ, drop_count?: number): void {
    if (drop_count) {
      this.send('{type:"dialog",dialog:"pack",id:"' + item.id + '",remove:' + drop_count + ',money:' + this.money + '}');
    } else {
      if (item.is_money) {
        this.send('{type:"dialog",dialog:"pack",money:' + this.money + '}');
        return;
      }
      const str: string[] = ['{type:"dialog",dialog:"pack",'];

      str.push('name:"');
      str.push(item.color_name);
      str.push('",id:"');
      str.push(item.id);
      str.push('",count:');
      str.push(item.count.toString());
      str.push(',grade:');
      str.push(item.grade.toString());
      str.push(',unit:"');
      str.push(item.unit);
      str.push('"');
      if (item.is_equipment) {
        str.push(',can_eq:1');
      }
      if (item.on_use) {
        str.push(',can_use:1');
      }
      if (item.on_study) {
        str.push(',can_study:1');
      }
      if (item.on_open) {
        str.push(',can_open:1');
      }
      if (item.combine_count) {
        str.push(',can_combine:' + item.combine_count);
      }
      str.push(',value:');
      str.push(item.transable ? item.value.toString() : '0');
      str.push(',money:');
      str.push(this.money.toString());
      str.push('}');
      this.send(str.join(''));
    }
  }

  /** 通知客户端技能变更 */
  on_skillchanged(): void {
    const str: string[] = ['{type:"perform",skills:['];
    if (this.skills) {
      const bases = ['', 'force', 'unarmed', 'dodge', 'parry', 'throwing'];
      const weapon = this.query_weapon_type();
      if (weapon !== WEAPON_TYPE.NONE) bases[0] = weapon;
      for (let i = 0; i < bases.length; i++) {
        const base_type = bases[i];
        if (!base_type) continue;
        const base_skill = this.skills[base_type];
        if (base_skill) {
          const sp_skill = SKILL.get(base_skill.enable_skill || base_type);
          if (sp_skill && sp_skill.pfm) {
            const sk_level = this.query_skill(base_skill.enable_skill || base_type, 0);
            for (const p in sp_skill.pfm) {
              const pfmitem = sp_skill.pfm[p];
              if (pfmitem.check && !pfmitem.check(this, sk_level, base_type)) continue;
              if (pfmitem.enable_skill && pfmitem.enable_skill !== base_type) continue;
              if (str.length > 1) str.push(',');
              str.push('{id:"');
              str.push(base_type + '.' + p);
              str.push('",name:"');
              str.push(pfmitem.query_name?.(this, base_type) || "");
              str.push('"');
              if (pfmitem.distime) {
                str.push(',distime:');
                str.push(pfmitem.query_distime?.(this).toString() || "0");
              }
              str.push('}');
            }
          }
          if (base_skill.enable_skill) {
            const pfmitem = this.query_ref_skill(this.skills[base_skill.enable_skill]);
            if (pfmitem && pfmitem.enable_skill && pfmitem.enable_skill === bases[i]) {
              if (str.length > 1) str.push(',');
              str.push('{id:"');
              str.push(bases[i] + '.ref');
              str.push('",name:"');
              str.push(pfmitem.query_name?.(this, base_type) || "");
              str.push('"');
              if (pfmitem.distime) {
                str.push(',distime:');
                str.push(pfmitem.query_distime(this, this.query_skill(base_skill.enable_skill), true));
              }
              str.push('}');
            }
          }
        }
      }
    }
    str.push(']');
    str.push('}');
    this.send(str.join(''));
  }

  // ============ 家园系统 ============

  /** 回到自己的家 */
  go_home(): void {
    const my_room = this.query_home();
    this.moveto(my_room!, this.name + '向里面走去。');
  }

  /**
   * 查询家园房间
   */
  query_home(rm_name?: string): ROOM | null {
    const home: any = this.query_temp('home');
    if (!home) return null;
    if (!rm_name) rm_name = home == 1 ? 'home/danjian' : 'home/yuanzi';
    const rm = ROOM.Get(rm_name);
    if (!rm) return null;
    let my_room = rm.query_copy2(this);
    if (!my_room) {
      my_room = rm.create_copy2(this);
    }
    return my_room as ROOM;
  }

  // ============ 经济系统 ============

  /**
   * 增加积分
   */
  add_score(val: number): void {
    if (!val) return;
    this.score += val;
    WORLD.STATS.updateScore(this);
  }

  /**
   * 增加金钱
   * @returns 是否成功
   */
  add_money(val: number): boolean {
    const money = parseInt(String(this.money + val));
    if (!(money >= 0)) return false;
    this.money = money;
    return true;
  }

  /**
   * 增加元宝
   */
  add_cash(count: number, desc: string): void {
    if (!(count > 0 || count < 0)) return;
    this.cash_money += count;
    WORLD.log(this, desc, count.toString());
    if (count >= 0) {
      this.notify('<hio>你获得了' + count + '元宝。</hio>');
    }
    this.send(`{"type":"dialog","dialog":"shop","money":[${this.money},${this.cash_money}]}`);
  }

  /**
   * 查询元宝数量
   */
  query_cash(is_cash?: boolean): number {
    return this.cash_money;
  }

  // ============ 随从系统 ============

  /**
   * 是否可以跟随此NPC
   */
  can_follow(npc: NPC): boolean {
    if (!this.follower) this.follower = [];
    const max: number = (this.query_temp('max_follower') as number) || 3;
    if (this.follower.length >= max) return false;
    for (let i = 0; i < this.follower.length; i++) {
      if (this.follower[i].path == (npc as { path: string }).path) {
        return false;
      }
    }
    return true;
  }

  /**
   * 添加随从
   */
  add_follower(npc: NPC): boolean {
    if (!this.can_follow(npc)) return false;
    const item: FollowerDesc = {
      path: (npc as { path: string }).path,
      id: npc.id,
    };
    (this.follower as FollowerDesc[]).push(item);
    FOLLOWER.INIT(this, item);
    return true;
  }

  /**
   * 清除家园和随从
   */
  clear_home(clear_follower: boolean = true): void {
    let home = ROOM.Get('home/yuanzi');
    if (home) {
      home = home.query_copy(this.id);
      if (home) home.clear_copy(this);
    }
    if (clear_follower) {
      FOLLOWER.CLEAR(this);
    } else {
      FOLLOWER.RESET(this);
    }
  }

  // ============ 技能与战斗 ============

  /**
   * 清除技能冷却时间
   */
  clear_distime(pfmid?: string): void {
    if (!this.temp) return;
    if (pfmid) {
      this.temp['pfm/' + pfmid] = null;
      this.send('{type:"clearDistime",id:"' + pfmid + '"}');
    } else {
      for (const key in this.temp) {
        if (key.startsWith('pfm/')) {
          this.temp[key] = null;
        }
      }
      this.send('{type:"clearDistime"}');
    }
  }

  /**
   * 添加战斗属性(临时)
   */
  add_combat_prop(name: string, val: number): void {
    this.add_prop(name, val);
    if (!this.combat_props) this.combat_props = [];
    this.combat_props.push([name, val]);
  }

  /**
   * 清除所有战斗临时属性
   */
  clear_combat_prop(name?: string, val?: number): void {
    if (this.combat_props) {
      for (let i = 0; i < this.combat_props.length; i++) {
        this.add_prop(this.combat_props[i][0], -this.combat_props[i][1]);
      }
      this.combat_props = null;
      this.recount();
      this.notify_hp();
    }
  }

  // ============ 属性计算(玩家版本) ============

  /** 重新计算属性(玩家版本, 含闪避/招架技能加成) */
  recount(): void {
    this.max_hp = parseInt(
      (this.con * 5
        + (this.max_mp * this.query_force_rad()
          + this.query_prop('max_hp')
          + this.query_prop('con') * this.con)
        * (100 + this.query_prop('hp_per')) / 100),
    );

    if (this.hp > this.max_hp) this.hp = this.max_hp;

    this.gjsd = 4000 - this.query_prop('gjsd');
    if (this.gjsd > 500) {
      this.gjsd = parseInt(
        (this.gjsd - (this.gjsd * this.query_prop('gjsd_per') / 100)),
      );
      if (this.gjsd < 500) this.gjsd = 500;
    } else {
      this.gjsd = 500;
    }

    this.gj = parseInt(
      (this.str
        + (this.query_prop('gj') + this.query_prop('str') * this.str / 10)
        * (100 + this.query_prop('gj_per')) / 100),
    );
    this.fy = parseInt(
      (((this.str + this.con) / 10
        + this.query_prop('fy')
        + this.query_prop('con') * this.con / 10)
        * (100 + this.query_prop('fy_per')) / 100),
    );
    this.mz = parseInt(
      ((this.dex / 2 + this.query_prop('mz'))
        * (100 + this.query_prop('mz_per')) / 100),
    );
    this.ds = parseInt(
      ((this.dex / 2
        + this.query_prop('ds')
        + this.query_prop('dex') * this.dex / 10)
        * (100 + this.query_prop('ds_per')) / 100),
    );
    if (this.dodge_skill?.on_recount_dodge) {
      this.ds += this.dodge_skill.on_recount_dodge(this);
    }
    this.zj = parseInt(
      ((this.str / 2
        + this.query_prop('zj')
        + this.query_prop('str') * this.str / 10)
        * (100 + this.query_prop('zj_per')) / 100),
    );
    if (this.parry_skill?.on_recount_parry) {
      this.zj += this.parry_skill.on_recount_parry(this);
    }
    this.bj = parseInt(this.dex / 10 + this.query_prop('bj_per'));
    this.diff_sh_per = this.query_prop('diff_sh_per');
    this.diff_fy_per = this.query_prop('diff_fy_per');
  }

  /** 境界提升 */
  level_up(): void {
    if (!this.level) {
      const sk = this.skill_limit();
      this.level = 1;
      this.notify('<hiy>恭喜你提升到了' + this.get_level_desc() + '境界。</hiy>');
      this.add_exp(10000, 10000);
      const nowSk = this.skill_limit();
      this.limit_mp += 1000;
      this.notify('<hiw>你的内力限制增加了1000。</hiw>');
      this.notify('<hiw>你的技能等级限制增加了' + (nowSk - sk) + '。</hiw>');
    } else if (this.level == 1) {
      const sk = this.skill_limit();
      this.level = 2;
      this.notify('<hiy>恭喜你提升到了' + this.get_level_desc() + '境界。</hiy>');
      this.add_exp(100000, 100000);
      const nowSk = this.skill_limit();
      this.limit_mp += 5000;
      this.notify('<hiw>你的最大内力限制增加了5000。</hiw>');
      this.notify('<hiw>你的技能等级限制增加了' + (nowSk - sk) + '。</hiw>');
    } else if (this.level == 2) {
      const sk = this.skill_limit();
      this.level = 3;
      this.notify('<hiy>恭喜你提升到了' + this.get_level_desc() + '境界。</hiy>');
      this.add_exp(200000, 200000);
      const nowSk = this.skill_limit();
      this.limit_mp += 10000;
      this.notify('<hiw>你的最大内力限制增加了10000。</hiw>');
      this.notify('<hiw>你的技能等级限制增加了' + (nowSk - sk) + '。</hiw>');
    } else if (this.level == 3) {
      const sk = this.skill_limit();
      this.level = 4;
      this.notify('<hiy>恭喜你提升到了' + this.get_level_desc() + '境界。</hiy>');
      this.add_exp(500000, 500000);
      const nowSk = this.skill_limit();
      this.limit_mp += 20000;
      this.notify('<hiw>你的最大内力限制增加了20000。</hiw>');
      this.notify('<hiw>你的技能等级限制增加了' + (nowSk - sk) + '。</hiw>');
    } else if (this.level == 4) {
      const sk = this.skill_limit();
      this.level = 5;
      this.notify('<hiy>恭喜你提升到了' + this.get_level_desc() + '境界。</hiy>');
      this.add_exp(1000000, 1000000);
      const nowSk = this.skill_limit();
      this.limit_mp += 50000;
      this.notify('<hiw>你的最大内力限制增加了50000。</hiw>');
      this.notify('<hiw>你的技能等级限制增加了' + (nowSk - sk) + '。</hiw>');
    } else if (this.level == 5) {
      const sk = this.skill_limit();
      this.level = 6;
      this.notify('<hiy>恭喜你提升到了' + this.get_level_desc() + '境界。</hiy>');
      this.add_exp(2000000, 2000000);
      this.limit_mp += 500000;
      this.add_temp('fenpei', 1);
      this.notify('<hiw>你的最大内力限制增加了500000。</hiw>');
      this.notify('<hiw>你的先天属性增加了1点。</hiw>');
    }
    this.color_name = '';
    this.environment!.item_changed(this, true);
    this.send(`{type:"levelup",level:${this.level}}`);
  }

  // ============ 队伍系统 ============

  /**
   * 判断是否在同一队伍
   */
  is_team(p: CHARACTER): boolean | undefined {
    if (!p || !p.team) return;
    return this.team == p.team;
  }

  /**
   * 查询队伍ID
   */
  query_teamid(): string {
    if (this.team) return (this.team as CHARACTER[] & { id?: string }).id || this.id;
    return this.id;
  }

  /**
   * 是否可以传送
   */
  can_trans(): boolean {
    if (!this.environment) return true;
    if (this.environment.is_fb()) return this.notify_fail('你现在正在副本区域。');
    if ((this.environment as ROOM).parent?.on_leave?.(this) == false) return false;
    return true;
  }

  // ============ 区域解锁 ============

  /** 解锁当前区域 */
  enable_area(): void {
    const area = (this.environment as ROOM).parent!;
    const jd_idx = area.jd_index!;
    if (!(jd_idx >= 0)) return;
    if (!this.query_bool('fb2', jd_idx)) {
      this.set_bool('fb2', jd_idx, true);
      this.send('<him>你解锁新地图【' + area.name + '】。</him>');
      this.send(`{type:"dialog",dialog:"jh",unlock2:${this.query_temp('fb2', 0)}}`);
    }
  }

  /**
   * 检查区域是否已解锁
   */
  isenable_area(fb: any): boolean {
    if (!fb) return false;
    if (typeof fb === 'number') {
      return this.query_bool('fb2', fb);
    }
    if (!(fb.jd_index >= 0)) return false;
    return this.query_bool('fb2', fb.jd_index);
  }

  /**
   * 按位查询布尔值
   */
  query_bool(key: string, index: number): boolean {
    let step = Math.floor(index / 32);
    if (step > 0) key = key.toString() + step.toString();
    const num: number = (this.query_temp(key, 0) as number) || 0;
    if (!num) return false;
    const bit = index % 32;
    return (num & (1 << bit)) !== 0;
  }

  /**
   * 按位设置布尔值
   */
  set_bool(key: string, index: number, value: any, time?: number): void {
    let step = Math.floor(index / 32);
    if (step > 0) key = key.toString() + step.toString();
    const num: number = (this.query_temp(key, 0) as number) || 0;
    const bit = index % 32;
    if (value) {
      this.set_temp(key, num | (1 << bit), time);
    } else {
      this.set_temp(key, num & ~(1 << bit), time);
    }
  }

  /**
   * 清除位标记区域
   */
  clear_bool(key: string, count: number): void {
    const num: number = (this.query_temp(key, 0) as number) || 0;
    if (!num) return;
    for (let i = 0; i < count; i++) {
      if ((num & (1 << i)) !== 0) {
        return;
      }
    }
    this.remove_temp(key);
  }

  // ============ 精力系统 ============

  /**
   * 消耗精力值
   */
  expend_jingli(val: number): boolean {
    if (val > 0 && this.query_jingli() >= val) {
      const expend: number = (this.query_temp('ex_jl', 0) as number) || 0;
      if (expend >= 200) {
        const add: number = (this.query_temp('ad_jl', 0) as number) || 0;
        if (add < val) return false;
        this.add_temp('ad_jl', -val);
      } else {
        if (expend + val > 200) {
          this.set_temp('ex_jl', 200, (UTIL as { diff_time(h?: number): number }).diff_time());
          val = val - (200 - expend);
          this.add_temp('ad_jl', -val);
        } else {
          this.add_temp('ex_jl', val, (UTIL as { diff_time(h?: number): number }).diff_time());
        }
      }
      return true;
    }
    return false;
  }

  /**
   * 检查自定义技能ID
   */
  create_for(id: string): boolean {
    if (!(this as { custom_skills?: string[] }).custom_skills) return false;
    return (this as { custom_skills?: string[] }).custom_skills!.indexOf(id) > -1;
  }

  /**
   * 查询玩家年龄
   */
  query_age(): number {
    const dt = Date.now() - (this as Record<string, any>).reg_time * 60000;
    return 14 + dt / 86400000 / 12 - this.query_prop('age') - (this.query_temp('age', 0) as number);
  }
}
