// ============================================================
// 回调事件签名 — 每个类可选的 on_xxx 回调属性
// ============================================================

import type { CHARACTER } from '../core/char/character.js';
import type { USER } from '../core/char/user.js';
import type { NPC } from '../core/char/npc.js';
import type { FOLLOWER } from '../core/char/follower.js';
import type { OBJ } from '../core/item/obj.js';
import type { EQUIPMENT } from '../core/item/equipment.js';
import type { ROOM } from '../core/room/room.js';
import type { CORPSE } from '../core/item/corpse.js';
import type { SKILL, PERFORM } from '../core/skill/skill.js';

// ============================================================
// CHARACTER 回调
// ============================================================

export interface CharacterCallbacks {
  /** 角色创建后调用 */
  on_create?: (me: CHARACTER) => void;
  /** 角色克隆后调用 */
  on_clone?: (me: CHARACTER) => void;
  /** 角色死亡时调用 */
  on_die?: (me: CHARACTER, killer: CHARACTER) => void;
  /** 角色死亡后调用（尸体已生成） */
  on_died?: (me: CHARACTER, killer: CHARACTER, corpse: CORPSE) => void;
  /** 角色复活时调用 */
  on_relive?: (me: CHARACTER) => void;
  /** 心跳回调 */
  on_heart_beat?: (me: CHARACTER, now: number) => void;
  /** 队伍离开回调 */
  on_teamout?: (me: CHARACTER) => void;
  /** 战斗结束回调 */
  on_fight_over?: (me: CHARACTER) => void;
  /** 技能变化回调 */
  on_skillchanged?: (me: CHARACTER, skillId: string, level: number) => void;
}

// ============================================================
// NPC 回调
// ============================================================

export interface NPCCallbacks extends CharacterCallbacks {
  /** 查询师傅回调 (返回 false 拒绝拜师) */
  on_master?: (me: USER) => CHARACTER | false | void;
  /** 检查技能回调 */
  on_checkskill?: (me: CHARACTER) => boolean | void;
  /** 绝招触发回调 */
  on_pfm?: (me: CHARACTER, target: CHARACTER) => void;
  /** 双修回调 */
  on_makelove?: (me: USER) => void;
  /** 主人进入回调 */
  on_master_enter?: (me: USER) => void;
  /** 玩家离开回调 (返回 false 阻止离开) */
  on_leave?: (me: USER, dir: string) => boolean | void;
}

// ============================================================
// FOLLOWER 回调
// ============================================================

export interface FollowerCallbacks extends CharacterCallbacks {
  /** 主人学习技能 */
  on_master_learn?: (me: USER, skill: SKILL) => void;
  /** 主人进入 */
  on_master_enter?: (me: USER) => void;
}

// ============================================================
// OBJ 回调
// ============================================================

export interface ObjCallbacks {
  /** 使用物品 */
  on_use?: (me: CHARACTER, obj: OBJ) => void;
  /** 研读物品 */
  on_study?: (me: CHARACTER, obj: OBJ) => void;
  /** 打开物品 */
  on_open?: (me: CHARACTER, obj: OBJ) => void;
  /** 初始化物品 */
  on_init?: (obj: OBJ) => void;
  /** 物品创建 */
  on_create?: (obj: OBJ) => void;
  /** 热重载 */
  on_reload?: (obj: OBJ) => void;
  /** 被查看 */
  on_look?: (me: CHARACTER) => void;
}

// ============================================================
// EQUIPMENT 回调
// ============================================================

export interface EquipmentCallbacks extends ObjCallbacks {
  /** 装备组属性 (返回 set bonus) */
  group_prop?: (eqs: EQUIPMENT[]) => Record<string, number>;
}

// ============================================================
// SKILL 回调
// ============================================================

export interface SkillCallbacks {
  /** 启用技能 */
  on_enable?: (me: CHARACTER, skill: SKILL) => void;
  /** 禁用技能 */
  on_disenable?: (me: CHARACTER, skill: SKILL) => void;
  /** 学习技能 */
  on_learn?: (me: CHARACTER, skill: SKILL) => void;
  /** 招架回调 */
  on_force_parry?: (me: CHARACTER, target: CHARACTER, sh: number) => number;
  /** 查询启用属性 */
  query_enable_prop?: (lv: number) => Record<string, Record<string, number | string>>; // 见 skill.ts EnablePropMap
  /** 查询属性 */
  query_prop?: (me: CHARACTER, lv: number) => Record<string, number>;
}

// ============================================================
// PERFORM 回调
// ============================================================

export interface PerformCallbacks {
  /** 使用绝招 */
  on_use?: (me: CHARACTER, target: CHARACTER, lv: number) => void;
  /** 攻击触发 */
  on_attack?: (me: CHARACTER, target: CHARACTER, lv: number, damage: number) => void;
  /** 查询描述 */
  query_desc?: (me: CHARACTER, lv: number) => string;
}

// ============================================================
// ROOM 回调
// ============================================================

export interface RoomCallbacks {
  /** 进入房间回调 */
  on_enter?: (me: CHARACTER, dir: string) => void;
  /** 离开房间回调 */
  on_leave?: (me: CHARACTER, dir: string) => boolean | void;
  /** 心跳回调 */
  on_heart_beat?: (room: ROOM, now: number) => void;
}

// ============================================================
// STATUS (buff/debuff)
// ============================================================

export interface StatusDef {
  id: string;
  name: string;
  desc?: string;
  duration: number;
  prop?: Record<string, number>;
  is_busy?: boolean;
  is_faint?: boolean;
  override?: number;
  count?: number;
  on_interval?: (me: CHARACTER, over_count: number) => boolean | void;
  on_attach?: (me: CHARACTER) => void;
  on_expire?: (me: CHARACTER) => void;
  start_time?: number;
  finish_msg?: string;
  source?: string;
}

// ============================================================
// SKILL learn condition
// ============================================================

export interface LearnCondition {
  [key: string]: number | string | Record<string, number> | undefined;
  max_mp?: number;
  skill?: Record<string, number>;
  str1?: number;
  con1?: number;
  gender?: number | string;
  desc?: string;
}

// ============================================================
// EQUIPMENT condition
// ============================================================

export interface EquipCondition {
  [key: string]: string | number | undefined;
}
