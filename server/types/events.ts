// ============================================================
// 回调事件签名 — 每个类可选的 on_xxx 回调属性
// ============================================================

import type { CHARACTER } from '../core/char/character.js';
import type { USER } from '../core/char/user.js';
import type { OBJ } from '../core/item/obj.js';
import type { EQUIPMENT } from '../core/item/equipment.js';
import type { ROOM } from '../core/room/room.js';
import type { CORPSE } from '../core/item/corpse.js';
import type { PERFORM, SKILL } from '../core/skill/skill.js';
import type { DynamicProp, PropMap } from './props.js';

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
    /** 状态唯一标识 */
    id: string;
    /** 状态名称（显示用） */
    name: string;
    /** 状态描述 */
    desc?: string;
    /** 持续时间（秒） */
    duration: number;
    /** 状态附带的属性加成/减益 */
    prop?: PropMap;
    /** 是否忙碌状态（不可行动） */
    is_busy?: boolean;
    /** 是否昏迷状态 */
    is_faint?: boolean;
    /** 覆盖优先级（数值越大优先级越高） */
    override?: number;
    /** 状态叠加层数 */
    count?: number;
    /** 定时触发回调（返回 true 则移除状态） */
    on_interval?: (me: CHARACTER, over_count: number) => boolean | void;
    /** 状态附加时回调 */
    on_attach?: (me: CHARACTER) => void;
    /** 状态过期时回调 */
    on_expire?: (me: CHARACTER) => void;
    /** 绝招释放回调 */
    on_pfm?: (me: CHARACTER, target: CHARACTER, pfm: PERFORM, level: number, enable_skill: string) => PfmFlagType;
    /** 状态开始时间戳 */
    start_time?: number;
    /** 状态结束时的提示消息 */
    finish_msg?: string;
    /** 状态来源（技能/物品 ID） */
    source?: string;
    /** 恢复气血数值 */
    recover_hp?: number;
    /** 恢复内力数值 */
    recover_mp?: number;
}

export const PfmFlag = {
    /** 阻止继续释放绝招的流程，表现为根本放不出来，不会进入冷却 */
    BLOCK: 1 << 0, // 0b0001 
    /** 阻止释放绝招产生效果，扣蓝cd不生效 */
    NO_USE: 1 << 1, // 0b0010
    /** 消耗效果 */
    EXPEND_STATU: 1 << 3, // 0b0010
} as const;// 提取所有标记联合类型，强类型校验
export type PfmFlagType = typeof PfmFlag[keyof typeof PfmFlag];

// ============================================================
// SKILL learn condition
// ============================================================

export interface LearnCondition {
    [key: string]: number | string | Record<string, number> | undefined;

    /** 最大内力要求 */
    max_mp?: number;
    /** 前置技能及等级要求 { 技能ID: 等级 } */
    skill?: Record<string, number>;
    /** 臂力要求 */
    str1?: number;
    /** 根骨要求 */
    con1?: number;
    /** 性别要求（0/1 或 "男"/"女"） */
    gender?: number | string;
    /** 学习条件描述文本 */
    desc?: string;
}

// ============================================================
// EQUIPMENT condition
// ============================================================

export interface EquipCondition {
    /** 动态条件字段（如 max_mp, skill, str1 等），值为对应的要求值 */
    [key: string]: any;

    /** 最大内力要求 */
    max_mp?: number;
    /** 前置技能及等级要求 { 技能ID: 等级 } */
    skill?: Record<string, number>;
    /** 臂力要求 */
    str1?: number;
    /** 根骨要求 */
    con1?: number;
    /** 性别要求（0/1 或 "男"/"女"） */
    gender?: number | string;
    /** 学习条件描述文本 */
    desc?: string;
}
