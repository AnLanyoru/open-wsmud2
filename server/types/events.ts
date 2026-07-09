import type { CHARACTER } from '../core/char/character.js';
import type { PERFORM } from '../core/skill/skill.js';
import type { PropMap } from './props.js';
import type { PfmFlag } from '../core/const.js';

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
    /** 持续时间（毫秒） */
    duration: number;
    /** 状态附带的属性加成/减益 */
    prop?: PropMap;
    /** 是否忙碌状态（不可行动） */
    is_busy?: boolean;
    /** 是否昏迷状态 */
    is_faint?: boolean;
    /** 覆盖方法 0不覆盖，1叠层，2覆盖 */
    override?: number;
    /** 状态叠加层数 */
    count?: number;
    /** 定时触发回调（返回 false 则移除状态） */
    on_interval?: (me: CHARACTER, over_count: number) => boolean | void;
    /** 状态附加时回调 */
    on_attach?: (me: CHARACTER) => void;
    /** 状态过期时回调 */
    on_expire?: (me: CHARACTER) => void;
    /** 绝招释放回调 */
    on_pfm?: (
        me: CHARACTER,
        target: CHARACTER,
        pfm: PERFORM,
        level: number,
        enable_skill: string,
    ) => PfmFlagType;
    /** 状态开始时间戳 */
    start_time?: number;
    /** 状态结束时的提示消息（仅限第一人称占位符：$N/$P/$W/$w/$l/$T，禁用 $n/$p/$i） */
    finish_msg?: string | number;
    /** 状态来源（技能/物品 ID） */
    source?: string;
    /** 恢复气血数值 */
    recover_hp?: number;
    /** 恢复内力数值 */
    recover_mp?: number;
}

export type PfmFlagType = (typeof PfmFlag)[keyof typeof PfmFlag];

// ============================================================
// SKILL learn condition
// ============================================================

/** query_enable_prop 返回值：按基本技能类型分组的属性加成字典 */
export interface SkillAndLevel {
    /** 空手技能 */
    unarmed?: number;
    /** 招架技能 */
    parry?: number;
    /** 内功技能 */
    force?: number;
    /** 轻功技能 */
    dodge?: number;
    /** 剑法技能 */
    sword?: number;
    /** 刀法技能 */
    blade?: number;
    /** 杖法技能 */
    staff?: number;
    /** 棍法技能 */
    club?: number;
    /** 鞭法技能 */
    whip?: number;
    /** 暗器技能 */
    throwing?: number;
    /** 噬咬技能(怪物专用) */
    bite?: number;

    /** 允许 for...in 动态遍历时的字符串索引 */
    [key: string]: number | undefined;
}

export interface Condition {
    /** 前置技能ID → 等级要求 */
    skill?: SkillAndLevel;
    /** 先天臂力(不含装备加成) */
    str1?: number;
    /** 先天根骨(不含装备加成) */
    con1?: number;
    /** 先天身法(不含装备加成) */
    dex1?: number;
    /** 先天悟性(不含装备加成) */
    int1?: number;
    /** 总臂力(含装备加成) */
    str?: number;
    /** 总根骨(含装备加成) */
    con?: number;
    /** 总身法(含装备加成) */
    dex?: number;
    /** 总悟性(含装备加成) */
    int?: number;
    /** 性别要求(1男/2女/3无性) */
    gender?: number;
    /** 条件描述(仅展示,不做检查) */
    desc?: string;
    /** 最大内力 */
    max_mp?: number;
}

// ============================================================
// EQUIPMENT condition
// ============================================================

export interface LearnCondition extends Condition {}
export interface EquipCondition extends Condition {}
