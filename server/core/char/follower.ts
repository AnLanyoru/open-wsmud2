/**
 * FOLLOWER 随从类 - 玩家的跟随者/NPC伙伴
 */
import { CHARACTER } from './character.js';
import { USER } from './user.js';
import { NPC } from './npc.js';
import { FAMILIES } from '../skill/family.js';
import { CORPSE } from '../item/corpse.js';
import type { ROOM } from '../room/room.js';
import { UTIL } from '../util.js';
import { OBJ } from '../item/obj.js';
import type { EQUIPMENT } from '../item/equipment.js';
import type { SKILL } from '../skill/skill.js';
import type { FAMILY } from '../skill/family.js';
import type { AREA } from '../room/area.js';

// ============================================================
// 模块级常量
// ============================================================

/** 需保存的数值属性 */
const SAVE_NUMPROP = [
  'str', 'con', 'dex', 'int', 'gender', 'max_mp', 'limit_mp', 'exp', 'pot',
  'kar', 'per', 'hp', 'mp', 'max_item_count', 'money', 'level',
];

/** 需保存的字符串属性 */
const SAVE_STRPROP = ['id', 'name', 'title', 'desc'];

/** 死亡消息 */
const DIE_MSG = [
  '\n$N扑在地上挣扎了几下，腿一伸，口中喷出几口<HIR>鲜血</HIR>，死了！\n',
  '\n$N大叫一声倒在地上，挣扎了几下，<HIR>死了</HIR>！\n',
  '\n$N口中喷出几口<HIR>鲜血</HIR>，倒在地上,死了！\n',
];

// ============================================================
// 类型定义
// ============================================================

/** 随从存档数据格式 */
interface FOLLOWER_DATA {
  /** 随从 ID */
  id: string;
  /** 随从模板路径 */
  path: string;
  /** 数值属性数组（按 SAVE_NUMPROP 顺序） */
  prop: number[];
  /** 临时数据 */
  temp?: unknown[];
  /** 用户设置 */
  settings?: Record<string, number>;
  /** 技能数据 */
  skills?: Record<string, unknown>;
  /** 背包物品 */
  items?: unknown[];
  /** 装备列表 */
  eq?: unknown[];
  [key: string]: unknown;
}

/** 随从状态对象 */
interface FollowerState {
  /** 状态标题 */
  title: string;
  /** 状态触发频率（心跳次数） */
  rate?: number;
  /** 心跳累计计数 */
  heat_count?: number;
  /** 状态开始时间 */
  start_time?: number;
  /** 是否允许战斗中执行 */
  allow_fight?: boolean;
  /** 状态进入回调，返回 false 则自动停止 */
  on_enter?: (me: CHARACTER) => boolean | void;
  /** 状态停止回调，isauto 表示是否自动停止 */
  on_stop?: (me: CHARACTER, isauto?: boolean) => boolean | void;
}

// ============================================================
// FOLLOWER 类
// ============================================================

// @ts-ignore: static CREATE override incompatible with base
export class FOLLOWER extends CHARACTER {
  // ============ 核心属性 ============

  /** 是否自动释放绝招 */
  auto_pfm: boolean = true;
  /** 所属门派 */
  family: FAMILY = FAMILIES.NONE;
  /** 随从名称 */
  name!: string;
  /** 随从等级 */
  level: number = 3;
  /** 随从描述 */
  desc!: string;
  /** 随从称号 */
  title!: string;

  // ============ 主人相关 ============

  /** 主人ID */
  master: string | null = null;
  /** 主人名称 */
  master_name: string | null = null;
  /** 消息监听者(主人) */
  listener: USER | null = null;
  /** 主人可见命令JSON缓存 */
  master_json: string | null = null;

  // ============ 战斗与装备 ============

  /** 装备列表 */
  equipment: EQUIPMENT[] | null = null;

  // ============ 物品与设置 ============

  /** 最大背包容量 */
  max_item_count: number = 10;
  /** 随从设置 */
  settings: Record<string, number> = { auto_kill: 1, auto_dice: 1 };
  /** 背包金钱 */
  money: number = 0;
  /** 背包物品 */
  items: OBJ[] | null = null;

  // login_message — 用于 set_setting 清除缓存（该字段在 USER 上定义，FOLLOWER 在运行时按需创建）
  login_message: string | null = null;


  constructor() {
    super();
  }

  // ============ 回调属性（由资源文件设置） ============

  /** 亲热回调 — 触发时机：主人对随从执行双修命令时 */
  on_makelove?(me: USER): void;
  /** 主人进入回调 — 触发时机：主人进入随从所在房间时（on_enter 中判断 master 匹配后调用） */
  on_master_enter?(me: USER): void;
  /** 主人学习回调 — 触发时机：主人通过随从学习技能时 */
  on_master_learn?(me: USER, skill: SKILL): void;

  /**
   * 查询随从设置
   */
  query_setting(name: string): number {
    if (!this.settings) return 0;
    return this.settings[name] || 0;
  }

  /**
   * 设置随从配置
   */
  set_setting(name: string, value: string | number): void {
    if (!this.settings) this.settings = {};
    if (!value || value == '0') {
      delete this.settings[name];
    } else {
      if (value == '1') value = 1;
      this.settings[name] = value as unknown as number;
    }

    this.login_message = null;
  }

  /**
   * 发送消息(代为翻译人称)
   */
  send(text: string): void {
    if (this.listener) {
      text = text.replace('你', this.name);
      this.listener.send(text);
    }
  }

  /**
   * 通知消息
   */
  notify(text: string): void {
    this.send(text);
  }

  /**
   * 设置消息监听者
   */
  set_listener(me: CHARACTER, target: USER): void {
    if (me.id == this.master) this.listener = target;
  }

  // ============ 静态存储 ============

  /** 随从存储 */
  static STORES: Map<string, FOLLOWER> = new Map();

  /**
   * 清除所有随从
   */
  static CLEAR(me: USER): void {
    if (!me.follower) return;
    for (let i = 0; i < me.follower.length; i++) {
      const npc = FOLLOWER.STORES.get(me.id + '_' + me.follower[i].id);
      if (npc) {
        FOLLOWER.STORES.delete(me.id + '_' + me.follower[i].id);
        npc.set_state(null);
        npc.environment && npc.environment.item_changed(npc, false);
        npc.clear_status();
      }
    }
  }

  /**
   * 重置随从(不出现在当前场景)
   */
  static RESET(me: USER): void {
    if (!me.follower) return;
    for (let i = 0; i < me.follower.length; i++) {
      const npc = FOLLOWER.STORES.get(me.id + '_' + me.follower[i].id);
      if (npc) {
        npc.set_state(null);
        npc.environment && npc.environment.item_changed(npc, false);
      }
    }
  }

  /**
   * 从用户数据初始化随从
   */
  static INIT_FROM_USER(me: USER, datas: FOLLOWER_DATA[]): void {
    for (let j = 0; j < datas.length; j++) {
      const data = datas[j];
      let my_npc = FOLLOWER.STORES.get(me.id + '_' + data.id);
      if (my_npc) continue;
      if (!data.id) continue;
      my_npc = new FOLLOWER();
      const obj = NPC.CLONE(data.path);
      for (let i = 0; i < SAVE_NUMPROP.length; i++) {
        (my_npc as unknown as Record<string, unknown>)[SAVE_NUMPROP[i]] = data.prop[i] || 0;
      }
      for (let i = 0; i < SAVE_STRPROP.length; i++) {
        (my_npc as unknown as Record<string, unknown>)[SAVE_STRPROP[i]] = data[SAVE_STRPROP[i]] as unknown as string || (obj as unknown as Record<string, unknown>)[SAVE_STRPROP[i]] as unknown as string;
      }
      my_npc.on_makelove = obj ? obj.on_makelove : undefined;
      my_npc.on_master_enter = obj ? obj.on_master_enter : undefined;
      my_npc.equipment = data.temp as unknown as EQUIPMENT[] | null;
      my_npc.settings = data.settings ?? {};
      my_npc.skills = data.skills as unknown as Record<string, any>;
      my_npc.path = obj.path;
      my_npc.items = me.read_items(data.items as unknown as any[][]);
      my_npc.equipment = me.read_equipment(data.eq as unknown as any[][]);
      my_npc.level = my_npc.level || obj.level || 3;
      my_npc.init();
      my_npc.recount();
      my_npc.hp = my_npc.max_hp;
      my_npc.mp = my_npc.max_mp;
      FOLLOWER.STORES.set(me.id + '_' + my_npc.id, my_npc);
      my_npc.master = me.id;
      my_npc.master_name = me.name;
    }
  }

  /**
   * 初始化单个随从
   */
  static INIT(me: USER, par: { path: string; id: string }): FOLLOWER | undefined {
    if (!par || !par.path) return;
    let npc: FOLLOWER;
    const id = me.id + '_' + par.id;
    if (par.id) {
      npc = FOLLOWER.STORES.get(id) as FOLLOWER;
      if (npc) return npc;
    }
    const obj = NPC.CLONE(par.path);
    if (!obj) return;
    npc = new FOLLOWER();
    for (let i = 0; i < SAVE_NUMPROP.length; i++) {
      (npc as unknown as Record<string, unknown>)[SAVE_NUMPROP[i]] = (obj as unknown as Record<string, unknown>)[SAVE_NUMPROP[i]] || 0;
    }
    for (let i = 0; i < SAVE_STRPROP.length; i++) {
      (npc as unknown as Record<string, unknown>)[SAVE_STRPROP[i]] = (obj as unknown as Record<string, unknown>)[SAVE_STRPROP[i]] || '';
    }
    npc.on_makelove = obj.on_makelove;
    npc.on_master_enter = obj.on_master_enter;
    npc.equipment = obj.equipment as unknown as EQUIPMENT[] | null;
    npc.skills = obj.skills;
    npc.items = obj.items as unknown as OBJ[] | null;
    npc.id = par.id;
    npc.path = obj.path;
    npc.level = obj.level || 3;
    npc.init();
    npc.recount();
    FOLLOWER.STORES.set(id, npc);
    npc.master = me.id;
    npc.master_name = me.name;
    return npc;
  }

  /**
   * 替换随从(版本更新)
   */
  static REPLACE(me: USER, old: FOLLOWER, npc: NPC): void {
    if (!old || !npc) return;
    const copys = ['str', 'con', 'dex', 'int', 'gender', 'kar', 'per', 'name', 'title', 'desc', 'on_master_learn', 'on_master_enter'];
    for (let i = 0; i < copys.length; i++) {
      (old as unknown as Record<string, unknown>)[copys[i]] = (npc as unknown as Record<string, unknown>)[copys[i]];
    }
    if (!old.skills) old.skills = {};
    if (!old.equipment) old.equipment = [];
    if (npc.equipment && npc.equipment[0]) {
      if (old.equipment[0]) {
        (npc.items as unknown as unknown[]).push(npc.equipment[0]);
      } else {
        old.equipment[0] = npc.equipment[0];
      }
      npc.equipment[0] = null;
    }
    if (!old.items) old.items = [];
    if (npc.items && npc.items.length) {
      for (let i = 0; i < npc.items.length; i++) {
        old.items.push(npc.items[i] as unknown as OBJ);
      }
      npc.items.length = 0;
    }

    for (const sk in npc.skills) {
      const oldSkill = old.skills[sk];
      if (oldSkill && oldSkill.addin && oldSkill.addin.length) continue;
      if (!oldSkill || (oldSkill.level || 0) < ((npc.skills as Record<string, any>)[sk]?.level || 0)) {
        (old.skills as Record<string, any>)[sk] = (npc.skills as Record<string, any>)[sk];
      }
    }
    if ((npc.exp || 0) > old.exp) old.exp = npc.exp || 0;
    if ((npc.pot || 0) > old.pot) old.pot = npc.pot || 0;
    if ((npc.max_mp || 0) > old.max_mp) old.max_mp = npc.max_mp || 0;

    old.prop = {};
    old.init();
    if (old.status) {
      for (let j = old.status.length - 1; j >= 0; j--) {
        const item = old.status[j];
        old.change_buff(item, true, item.count ?? 1);
      }
    }
    old.recount();
    old.master_json = null;
    old.color_name = '';
    old.on_master_enter = npc.on_master_enter;
    old.on_makelove = npc.on_makelove;
    old.path = npc.path;
    old.level = npc.level > old.level ? npc.level : old.level;
    if (old.environment) {
      old.environment.item_changed(old, true);
    }
    if (me.follower) {
      for (let i = 0; i < me.follower.length; i++) {
        if (me.follower[i].id == old.id) {
          me.follower[i].path = npc.path;
          break;
        }
      }
    }
  }

  /**
   * 获取随从
   */
  static GET(me: USER, par: { id: string }): FOLLOWER | undefined {
    const id = me.id + '_' + par.id;
    return FOLLOWER.STORES.get(id);
  }

  /**
   * 创建随从
   */
  static CREATE(me: USER, par: { path: string; id: string }, callback: (npc: FOLLOWER) => void): void {
    if (!par || !par.path) return;
    const id = me.id + '_' + par.id;
    const npc = FOLLOWER.STORES.get(id);
    if (npc) return callback(npc);
  }

  // ============ 序列化 ============

  /**
   * 序列化随从数据
   */
  save(me: USER): string {
    const str: string[] = ['prop:['];
    for (let i = 0; i < SAVE_NUMPROP.length; i++) {
      str.push(((this as unknown as Record<string, unknown>)[SAVE_NUMPROP[i]] || 0).toString());
      str.push(',');
    }
    str.push('0],');
    const items = this.items || [];
    str.push('items:[');
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (i > 0) str.push(',');
        items[i].save_db(str);
      }
    }
    str.push(']');
    if (this.skills) {
      str.push(',skills:');
      str.push(JSON.stringify(this.skills));
    }
    if (this.temp) {
      str.push(',temp:', this.format_temp(this.temp));
    }
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
    return str.join('');
  }

  /**
   * 保存所有随从数据
   */
  static SAVE(me: USER): string {
    if (!me.follower) return '[]';
    const str: string[] = ['['];
    for (let i = 0; i < me.follower.length; i++) {
      const item = me.follower[i];
      if (str.length > 1) str.push(',');
      str.push('{path:"');
      str.push(me.follower[i].path);
      str.push('",id:"');
      str.push(me.follower[i].id);
      str.push('"');
      const npc = FOLLOWER.STORES.get(me.id + '_' + item.id);
      if (npc) {
        str.push(',');
        str.push(npc.save(me));
      }
      str.push('}');
    }
    str.push(']');
    return str.join('');
  }

  // ============ 死亡 ============

  /**
   * 随从死亡
   */
  die(killer: CHARACTER): boolean | undefined {
    if (!this.environment) return;
    if (this.on_die && this.on_die(killer) == false) {
      this.hp = 1;
      return false;
    }
    this.clear_status();
    this.send_room((DIE_MSG as unknown as { random(): string }).random());
    const corpse = new CORPSE();
    corpse.init(this, false);
    this.environment.item_changed(corpse, true);
    this.environment.item_changed(this, false);
    this.environment = null;
  }

  // ============ 心跳 ============

  /**
   * 随从心跳
   */
  heart_beat(dt: number): void {
    if (!this.hp) return;
    if (!this.fight_type) {
      if (this.hp < this.max_hp) {
        this.add_hp(Math.floor(this.max_hp / 3));
      }
      if (this.mp < this.max_mp) {
        this.add_mp(Math.floor(this.max_mp / 3));
      }
      if (this.chat_msg) {
        const r = this.random(10);
        if (r > 7) {
          this.send_message(this.chat_msg.random());
        }
      }
    }
    const st = this.state as unknown as FollowerState;
    if (st && (!this.fight_type || st.allow_fight)) {
      st.heat_count! += 1;
      if (st.heat_count! >= st.rate!) {
        st.heat_count = 0;
        if (st.on_enter?.(this as unknown as CHARACTER) === false) {
          this.set_state(null, true);
        }
      }
    }
  }

  /**
   * 设置随从状态
   */
  set_state(state: FollowerState | null, isauto?: boolean): void {
    if (this.state && !state) {
      const oldState = this.state as FollowerState;
      if (oldState.on_stop) {
        if (oldState.on_stop(this, isauto) == false) {
          return;
        }
      }
    }
    this.state = state as unknown as Record<string, unknown> | null;
    if (state) {
      state.rate = state.rate || 1;
      state.heat_count = 0;
      state.start_time = Date.now();
    }
    this.color_name = '';
    this.environment && this.environment.item_changed(this, true);
    this.master_json = null;
  }

  // ============ 命令查询 ============

  /**
   * 查询主人专用命令列表
   */
  query_mastercommands(): string {
    if (this.master_json) return this.master_json;
    const json: Record<string, any> = {};
    json.type = 'item';
    json.desc = this.desc;
    json.id = this.id;
    json.name = this.name;
    json.commands = [];
    json.commands.push({
      cmd: 'look ' + this.id,
      name: '查看',
    });
    json.commands.push({
      cmd: 'fight ' + this.id,
      name: '比试',
    });
    json.commands.push({
      cmd: 'score ' + this.id,
      name: '属性',
    });
    json.commands.push({
      cmd: 'pack ' + this.id,
      name: '背包',
    });
    json.commands.push({
      cmd: 'cha ' + this.id,
      name: '技能',
    });
    json.commands.push({
      cmd: 'team with ' + this.id,
      name: '组队',
    });
    json.commands.push({
      cmd: 'trade ' + this.id,
      name: '给' + this.call3() + '东西',
    });
    if (this.state) {
      json.commands.push({
        cmd: 'dc ' + this.id + ' stopstate',
        name: '停止' + (this.state as unknown as FollowerState).title.replace('中', ''),
      });
    }
    if ((this as unknown as { actions: { cmd: string; name: string }[] | null }).actions) {
      const actList = (this as unknown as { actions: { cmd: string; name: string }[] }).actions;
      for (let i = 0; i < actList.length; i++) {
        json.commands.push({
          cmd: actList[i].cmd,
          name: actList[i].name,
        });
      }
    }
    this.master_json = JSON.stringify(json);
    return this.master_json;
  }

  /**
   * 查询命令列表(区分主人/他人)
   */
  query_commands(player: USER): string {
    if (player.id == this.master) {
      return this.query_mastercommands();
    }
    if (this.json) return this.json;
    const json: Record<string, any> = {};
    json.type = 'item';
    json.desc = this.desc;
    json.id = this.id;
    json.follower = true;
    json.commands = [];
    json.commands.push({
      cmd: 'look ' + this.id,
      name: '查看',
    });
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
      cmd: 'ask ' + this.id + ' about 主人',
      name: '询问主人',
    });
    this.json = JSON.stringify(json);
    return this.json;
  }

  /**
   * 回应询问
   */
  on_ask(me: USER, par: string): void {
    switch (par) {
      case '主人':
        me.notify(this.name + '说道：我的主人就是' + this.master_name + '呀。');
        break;
    }
  }

  // ============ 队伍 ============

  /**
   * 加入队伍回调
   */
  on_teamin(me: USER): void {
    if (!this.team) return;
    for (let i = 0; i < this.team.length; i++) {
      const tm = this.team[i];
      if (this.master == tm.id) {
        this.do_follow(tm);
      }
    }
  }

  /**
   * 离开队伍回调
   */
  on_teamout(me: USER): void {
    if (!this.team) return;
    for (let i = 0; i < this.team.length; i++) {
      const tm = this.team[i];
      if (this.master == tm.id) {
        this.do_follow(null);
        if (this.environment && this.environment.is_fb()) {
          this.environment.item_changed(this, false, this.name + '离开了。');
        }
      }
    }
  }

  // ============ 显示 ============

  /**
   * 完整显示名称
   */
  long_name(): string {
    if (this.color_name) return this.color_name;
    const str: string[] = [];
    if (this.title) {
      str.push(this.title);
      str.push(' ');
    }
    str.push(this.name);
    if (this.state) {
      str.push('<hig>&lt;' + (this.state as unknown as FollowerState).title + '&gt;</hig>');
    }
    this.color_name = str.join('');
    return this.color_name;
  }

  // ============ 出入房间 ============

  /**
   * 主人进入房间回调
   */
  on_enter(me: USER): void {
    if (me.id == this.master) {
      this.on_master_enter?.(me);
    }
  }

  /**
   * 主人离开房间回调
   */
  on_master_leave(me: USER, nextrm: ROOM): boolean {
    if (this.state || !this.team || this.team != me.team) return false;
    if (this.hp <= 0) return false;
    if (me.environment === this.environment) return false;

    if (nextrm.is_fb() || (nextrm.parent as AREA).id == 'home') {
      return true;
    }

    return false;
  }

  // ============ USER方法代理 ============

  remove_obj(obj: OBJ | string, count?: number): OBJ | undefined {
    return (USER.prototype as unknown as Record<string, Function>).remove_obj.call(this, obj, count);
  }

  recount(): void {
    return (USER.prototype as unknown as Record<string, Function>).recount.call(this);
  }

  items_changed(item: OBJ, drop_count?: number): void {
    return (USER.prototype as unknown as Record<string, Function>).items_changed.call(this, item, drop_count);
  }

  send_commands(...args: string[]): void {
    return (USER.prototype as unknown as Record<string, Function>).send_commands.apply(this, args);
  }
}
