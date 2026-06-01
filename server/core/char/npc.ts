// ============================================================
// NPC - 非玩家角色类
// ============================================================

import { CHARACTER } from './character.js';

// @ts-ignore - Legacy JS module
import { FAMILIES } from '../skill/family.js';
import type { FAMILY } from '../skill/family.js';
// @ts-ignore - Legacy JS module
import { ROOM } from '../room/room.js';
// @ts-ignore - Legacy JS module
import { OBJ } from '../item/obj.js';
// @ts-ignore - Legacy JS module
import { WORLD } from '../world.js';
// @ts-ignore - Legacy JS module
import { BASE } from '../base.js';
// @ts-ignore - Legacy JS module
import { CORPSE } from '../item/corpse.js';
import type { ActionMap } from '../../types/base.js';

declare var __PATH: Record<string, string>;

// ============================================================
// NPC 类
// ============================================================

// @ts-ignore: static CREATE override incompatible with base
export class NPC extends CHARACTER {

  // ============ 核心属性 ============

  /** 是否自动释放绝招 */
  auto_pfm: boolean = true;
  /** 所属门派 */
  family: FAMILY = FAMILIES.NONE;
  /** NPC 名称 */
  name!: string;
  /** NPC 等级 */
  level: number = 0;
  /** NPC 描述 */
  desc!: string;

  // ============ 功能属性 ============

  /** 闲聊消息列表 */
  chat_msg: string[] | null = null;
  /** 闲聊触发概率（百分比） */
  chat_chance: number = 0;
  /** 出售物品列表 */
  sell_list: OBJ[] | null = null;
  /** 死亡后重生房间 */
  die_room: ROOM | null = null;
  /** 是否禁止刷新（不重生） */
  no_refresh: boolean = false;
  /** 击杀奖励积分 */
  score: number = 0;
  /** 任务主人 ID */
  master: string | null = null;
  /** 关联玩家 ID（首席弟子 NPC 绑定） */
  userid?: string;
  /** 对话问题 */
  question: Record<string, (me: CHARACTER) => void> | null = null;

  /** 禁止战斗标识 */
  no_fight: boolean = false;

  /** 是否为 NPC */
  is_npc: boolean = true;

  // ============ 运行时动态属性（由任务/战斗系统注入） ============

  /** 难度等级（BOSS/襄阳守城动态设置） */
  diff_level?: number;
  /** 自动绝招释放概率（0-1） */
  pfm_rate?: number;
  /** 襄阳守城：是否大宋守军 */
  is_dasong?: boolean;
  /** 襄阳守城：是否蒙古兵 */
  is_menggubing?: boolean;
  /** 襄阳守城：所属城门索引 */
  gate_index?: number;
  /** 襄阳守城：是否城墙守军 */
  iswall?: boolean;
  /** BOSS任务：BOSS等级索引 */
  boss_index?: number;
  /** BOSS任务：最小副本索引 */
  min_fbindex?: number;
  /** BOSS任务：关联活动事件ID */
  event_id?: string;
  /** 掉落分配：是否禁止队伍分配 */
  no_alloc?: boolean;
  /** 追杀任务：玩家查询（npc.query_temp("player")）复用 CHARACTER 的 query_temp */

  // ============ 运行时方法（由资源文件注入） ============

  /** 根据玩家属性初始化 NPC（衙门/追杀 NPC 用） */
  init_from(player: Record<string, any>, ...args: any[]): void {}

  // ============ 回调字段（由资源文件设置） ============

  /** 拜师回调 — 触发时机：玩家执行 bai 命令时；返回 CHARACTER 可指定师傅，返回 false 拒绝拜师 */
  on_master?(me: Record<string, any>): CHARACTER | false | void;
  /** 检查技能/学习回调 — 触发时机：玩家执行 cha 命令查看可学技能时；返回 false 阻止学习 */
  on_checkskill?: (me: CHARACTER) => boolean | void;
  /** 绝招触发回调 — 触发时机：NPC 自动释放绝招之前 */
  on_pfm?: (me: CHARACTER, target: CHARACTER) => void;
  /** 双修回调 — 触发时机：玩家对 NPC 执行双修命令时 */
  on_makelove?: (me: Record<string, any>) => void;
  /** 主人进入回调 — 触发时机：主人（master）进入 NPC 所在房间时 */
  on_master_enter?: (me: Record<string, any>) => void;
  /** 击杀回调 — 触发时机：BOSS/任务 NPC 被击杀时（由 world/ 资源文件设置） */
  on_kill?(killer: Record<string, any>): void;
  constructor() {
    super();
  }

  // ================================================================
  // 对话系统
  // ================================================================

  /**
   * 设置询问回调
   */
  set_ask(name: string, func: (me: CHARACTER) => void): void {
    if (!this.question) this.question = {};
    this.question[name] = func;
  }

  /**
   * 处理询问
   */
  on_ask(me: CHARACTER, par: string): void | false {
    if (!this.question) return;
    const item = this.question[par];
    if (!item) return;
    return item.call(this, me);
  }

  // ================================================================
  // 闲聊系统
  // ================================================================

  /**
   * 设置闲聊消息
   */
  set_chat_msg(items: string[], chance?: number): void {
    if (items) {
      this.chat_msg = items;
    }
  }

  /** 随机发送闲聊消息 */
  do_chat_msg(): void {
    if (!this.is_fighting() && this.is_living() && this.chat_msg) {
      this.do_say(this.chat_msg[Math.floor(Math.random() * this.chat_msg.length)]);
    }
  }

  // ================================================================
  // 显示方法
  // ================================================================

  /**
   * 格式化装备显示
   */
  format_equipments(call3: string, str: string[], eqcmd?: string): void {
    if (this.equipment && this.equipment.length) {
      const eqstr: string[] = [];
      for (let i = 0; i < this.equipment.length; i++) {
        const item = this.equipment[i];
        if (!item) continue;
        eqstr.push("<span cmd='", eqcmd || 'look', ' ', String(i), ' of ', this.id, "'>◆", item.color_name, "</span>\n");
      }
      if (eqstr.length) {
        str.push(call3, '装备着：\n', eqstr.join(''));
        return;
      }
    }
    str.push(call3, '穿着一件<wht>布衣</wht>。\n');
  }

  /**
   * 设置出售物品列表
   */
  set_goods(...items: string[]): void {
    if (!items.length) return;
    this.sell_list = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const obj = OBJ.CREATE(item);
      if (!obj) continue;
      obj.count = -1;
      this.sell_list.push(obj);
    }
  }

  /**
   * 查询操作命令 JSON（缓存）
   */
  query_commands(player?: CHARACTER): string {
    if (this.json) return this.json;
    this.json = this.query_commands_json(player, false);
    return this.json;
  }

  /**
   * 构建操作命令 JSON
   */
  query_commands_json(player: CHARACTER | undefined, isyb: boolean): string {
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
    if (!this.no_fight)
      json.commands.push({
        cmd: 'fight ' + this.id,
        name: '比试',
      });
    json.commands.push({
      cmd: 'kill ' + this.id,
      name: '击杀',
    });
    if (this.on_master) {
      json.commands.push({
        cmd: 'bai ' + this.id,
        name: '拜师',
      });
    }
    if (this.on_checkskill || this.on_master) {
      json.commands.push({
        cmd: 'cha ' + this.id,
        name: '学习',
      });
      json.master = true;
    }
    if (this.sell_list) {
      json.commands.push({
        cmd: 'list ' + this.id,
        name: '购买',
      });
      json.trader = true;
    }
    if (this.question) {
      for (const cmd in this.question) {
        json.commands.push({
          cmd: 'ask ' + this.id + ' about ' + cmd,
          name: '询问' + cmd,
        });
      }
    }
    if (this.actions) {
      for (const cmd in this.actions) {
        if (!this.actions[cmd].name) continue;
        json.commands.push({
          cmd: cmd + ' ' + this.id,
          name: this.actions[cmd].name,
        });
      }
    }
    return JSON.stringify(json);
  }

  /**
   * 更新房间内交互命令
   */
  update_action(acts: ActionMap<NPC>): void {
    this.json = null;
    this.actions = acts;
  }

  // ================================================================
  // 死亡与复活
  // ================================================================

  /**
   * NPC 死亡处理
   */
  die(killer?: CHARACTER): boolean | undefined {
    if (!this.environment) return;
    if (this.on_die && this.on_die(killer!) == false) {
      this.hp = 1;
      return false;
    }
    this.hp = 0;
    this.clear_status();
    this.send_room(DIE_MSG[Math.floor(Math.random() * DIE_MSG.length)]);
    this.clear_follow();
    const corpse = new CORPSE();
    const isinfb = this.environment.is_fb();
    corpse.init(this, isinfb);
    this.die_room = this.environment;
    this.environment.item_changed(corpse, true);
    this.environment.item_changed(this, false);
    if (isinfb && this.score && killer && (killer as Record<string, any>).add_fbscore) {
      (killer as Record<string, any>).add_fbscore(this.score);
    }
    if (!isinfb && !this.no_refresh && !this.master && !this.die_room.is_shadow) {
      this.call_out(this.relive.bind(this), this.on_master ? 60000 : 300000);
    }
    if (this.on_died) this.on_died(killer, corpse);
    WORLD.auto_get(killer, corpse, this);
    if (killer && killer.attack_skill && killer.attack_skill.on_enemy_die) {
      killer.attack_skill.on_enemy_die(killer, this);
    }
  }

  /** NPC 复活刷新 */
  relive(): void {
    if (!this.die_room) return;
    const room = ROOM.Get(this.die_room.path);
    if (!room) return;
    const obj = room.find_obj_bypath(this.path);
    if (obj) return;
    const npc = NPC.CLONE(this.path);
    room.item_changed(npc, true);
    this.die_room = null;
    this.equipment = null;
    this.items = null;
    this.skills = null;
  }

  /**
   * 销毁 NPC
   */
  destroy(msg?: string): void {
    if (this.environment) {
      this.environment.item_changed(this, false, msg);
    }
    this.clear_follow();
  }

  // ================================================================
  // 心跳
  // ================================================================

  /**
   * NPC 心跳处理
   */
  heart_beat(dt: number): void {
    if (!this.fight_type) {
      if (this.hp < this.max_hp) {
        this.add_hp(parseInt(String(this.max_hp / 2), 10));
      }
      if (this.mp < this.max_mp) {
        this.add_mp(parseInt(String(this.max_mp / 2), 10));
      }
      if (this.chat_msg) {
        if (this.random(10) > 8)
          this.send_message(this.chat_msg[Math.floor(Math.random() * this.chat_msg.length)]);
      }
      if (this.on_heart_beat) this.on_heart_beat(dt);
    } else if (this.hp <= 0) {
      const eny = this.query_enemy();
      if (!eny) {
        this.hp = 1;
        this.fight_type = 0;
      }
    }
  }

  /**
   * 发言 - NPC 闲聊时调用，默认空实现由资源文件覆写
   */
  do_say(msg?: string): void {
    return undefined;
  }

  // ================================================================
  // 静态方法
  // ================================================================

  /**
   * 创建 NPC 实例到指定房间
   */
  static CREATE(path: string, env: ROOM, oncreate?: (npc: NPC) => void, count?: number): NPC | undefined {
    if (!path || !env) return;
    count = count || 1;
    let obj: NPC | undefined;
    for (let i = 0; i < count; i++) {
      obj = NPC.CLONE(path);
      env.item_changed(obj, true);
      if (oncreate) oncreate(obj);
    }
    return obj;
  }

  /**
   * 克隆 NPC 实例
   */
  static CLONE(path: string): NPC {
    const base = NPC.GET(path);
    const item = Object.create(base) as NPC;
    item.clone();
    return item;
  }

  /**
   * 获取 NPC 模板（带缓存）
   */
  static GET(path: string): NPC {
    let base = WORLD.NPC_STROE.get(path) as NPC | undefined;
    if (!base) {
      base = BASE.CREATE(__PATH.NPC, path) as NPC;
      if (!base) throw new Error('没有人物' + path + '的定义。');
    }
    return base;
  }
}

// ================================================================
// NPC 死亡消息
// ================================================================

const DIE_MSG: string[] = [
  '\n$N扑在地上挣扎了几下，腿一伸，口中喷出几口<HIR>鲜血</HIR>，死了！\n',
  '\n$N大叫一声倒在地上，挣扎了几下，<HIR>死了</HIR>！\n',
  '\n$N口中喷出几口<HIR>鲜血</HIR>，倒在地上,死了！\n',
];
