// ============================================================
// 游戏属性类型定义
// ============================================================
/**
 * 属性映射 — 键为属性名，值为数值。
 * 使用显式接口而非 Record<> 的目的是：在对象字面量中悬停属性 key 时，
 * IDE 会显示该属性对应的 JSDoc 注释。
 *
 * 示例：
 *   ```ts
 *   const prop: PropMap = {
 *       fy_per: 10,  // 悬停 fy_per → 显示「防御力百分比加成」
 *   };
 *   ```
 */

export type DynamicProp = Record<string, string | number>;


export interface PropMap {
    // ===== 基础属性 =====
    /** 臂力 */ str?: number;
    /** 根骨 */ con?: number;
    /** 身法 */ dex?: number;
    /** 悟性 */ int?: number;
    /** 容貌 */ per?: number;
    /** 福缘 */ kar?: number;
    /** 年龄 */ age?: number;
    /** 性别 */ gender?: number;

    // ===== 战斗属性 =====
    /** 当前气血 */ hp?: number;
    /** 最大气血 */ max_hp?: number;
    /** 当前内力 */ mp?: number;
    /** 最大内力 */ max_mp?: number;
    /** 攻击力 */ gj?: number;
    /** 防御力 */ fy?: number;
    /** 命中 */ mz?: number;
    /** 躲闪 */ ds?: number;
    /** 招架 */ zj?: number;
    /** 暴击 */ bj?: number;
    /** 攻击速度 */ gjsd?: number;
    /** 防御速度 */ fysd?: number;
    /** 命中速度 */ mzsd?: number;
    /** 躲闪速度 */ dssd?: number;

    // ===== 百分比属性 =====
    /** 气血百分比加成 */ hp_per?: number;
    /** 内力百分比加成 */ mp_per?: number;
    /** 攻击力百分比加成 */ gj_per?: number;
    /** 防御力百分比加成 */ fy_per?: number;
    /** 命中百分比加成 */ mz_per?: number;
    /** 躲闪百分比加成 */ ds_per?: number;
    /** 招架百分比加成 */ zj_per?: number;
    /** 暴击百分比加成 */ bj_per?: number;
    /** 攻击速度百分比加成 */ gjsd_per?: number;
    /** 经验获取百分比加成 */ exp_per?: number;
    /** 潜能获取百分比加成 */ pot_per?: number;
    /** 内力加力上限 */ limit_mp?: number;
    /** 内功抗性/减免 */ force_rad?: number;
    /** 绝招释放时间（固定值减少） */ releasetime?: number;
    /** 绝招冷却时间（固定值减少） */ distime?: number;
    /** 内力消耗（固定值减少） */ expend_mp?: number;
    /** 内力消耗百分比减免 */ expend_mp_per?: number;
    /** 绝招释放时间百分比减免 */ releasetime_per?: number;
    /** 绝招冷却时间百分比减免 */ distime_per?: number;
    /** 对方受到的伤害增加% */ add_sh?: number;
    /** 无法防御（值>0生效） */ no_fy?: number;
    /** 疗伤效果百分比 */ recover_per?: number;
    /** 双修效率 */ shuangxiu?: number;
    /** 闭关经验 */ xiulian_exp?: number;
    /** 炼药产出 */ lianyao2?: number;
    /** 炼药经验百分比 */ lianyao_exp_per?: number;
    /** 挖矿经验 */ kuang_exp?: number;
    /** 挖矿潜能 */ kuang_pot?: number;
    /** 钓鱼经验 */ diaoyu_exp?: number;
    /** 钓鱼潜能 */ diaoyu_pot?: number;
    /** 采药经验 */ caiyao_exp?: number;
    /** 采药潜能 */ caiyao_pot?: number;
    /** 分解获得的玄晶 */ fenjie?: number;
    /** 负面状态抵抗（数值） */ diff_downside?: number;

    // ===== 特殊属性 =====
    /** 抗暴击 */ diff_bj?: number;
    /** 固定数值免伤 */ diff_sh?: number;
    /** 免伤百分比 */ diff_sh_per?: number;
    /** 破防百分比 */ diff_fy_per?: number;
    /** 免伤百分比 - 版本2 */ diff_sh_per2?: number;
    /** 破防百分比 - 版本2 */ diff_fy_per2?: number;

    /** 数值忙乱减免 */ diff_busy?: number;
    /** 百分比忙乱减免 */ diff_busy_per?: number;
    /** 数值忙乱加成 */ busy?: number;
    /** 百分比忙乱加成 */ busy_per?: number;
    /** 百分比负面状态抵抗 */ diff_downside_per?: number;

    /** 忽视防御 */ ignore_fy?: number;
    /** 最终伤害百分比 */ add_sh_per?: number;
    /** 暴击伤害百分比 */ add_bjsh_per?: number;
    /** 忽视躲闪（无视对方闪避概率） */ ignore_mz?: number;
    /** 额外攻击次数 */ attack_num?: number;
    /** 经验获取加成（数值） */ exp_add?: number;
    /** 潜能获取加成（数值） */ pot_add?: number;
    /** 积分获取加成（数值） */ score_add?: number;
    /** 每秒自动回血 */ auto_hp?: number;
    /** 每秒自动回内 */ auto_mp?: number;
    /** 护体（护体真气/罡气） */ obs?: number;
    /** 护盾值 */ shield?: number;
    /** 伤害百分比加成 */ damage_per?: number;
    /** 技能伤害加成 */ skill_damage?: number;
    /** 减伤（最终伤害减免） */ reduce_damage?: number;
    /** 背包最大容量 */ max_item_count?: number;

    // ===== 日常属性 =====
    /** 学习效率% */ study_per?: number;
    /** 练习效率% */ lianxi_per?: number;
    /** 打坐效率% */ dazuo_per?: number;
    /** 采药效率加成数值 */ caiyao1?: number;
    /** 钓鱼效率加成数值 */ diaoyu1?: number;
    /** 挖矿效率加成数值 */ kuang1?: number;
    /** 炼药效率加成数值 */ lianyao1?: number;

    // ===== 没用属性 =====
    /** 无效果的介绍 */ desc?: string;

    /** 允许自定义属性 */
    // [key: string]: number | undefined;
}

/** EQUIPMENT 属性定义 */
export interface EquipPropDef {
    [key: string]: number | undefined;
}

/** SKILL enable 属性描述 */
export interface SkillEnableProp {
    [key: string]: number | string | undefined;

    desc?: string;
}

/** 技能 slot 定义 */
export interface SkillSlotDef {
    prop: string;
    value: number | ((lv: number) => number);
    format?: (val: number) => string;
}

/** 战斗属性元组 [name, val] */
export type CombatPropTuple = [string, number];

// ============================================================
// 常量类型
// ============================================================

/** 技能类型常量 */
export const enum SkillType {
    SKILL = 0,    // 普通技能
    FORCE = 1,    // 内功
    DODGE = 2,    // 轻功
    UNARMED = 3,  // 拳脚
    PARRY = 4,    // 招架
    SWORD = 5,    // 剑法
    BLADE = 6,    // 刀法
    STAFF = 7,    // 杖法
    CLUB = 8,     // 棍法
    THROWING = 9, // 暗器
    WHIP = 10,    // 鞭法
    COMMON = 11,  // 通用/杂项
}

/** 装备类型常量 */
export const enum EquipType {
    WEAPON = 0,   // 武器
    CLOTH = 1,    // 衣服/护甲
    SHOES = 2,    // 鞋子
    HEAD = 3,     // 头部/头盔
    CAPE = 4,     // 披风
    RING = 5,     // 戒指
    NECKLACE = 6, // 项链
    JEWELS = 7,   // 饰品/佩饰
    WRIST = 8,    // 护腕
    WAIST = 9,    // 腰带
    THROWING = 10,// 投掷/暗器类装备
}

/** 物品类型 */
export const enum ObjType {
    NORMAL = 0,    // 普通物品
    DRUG = 1,      // 药品
    BOOK = 2,      // 书籍/秘笈
    EQUIPMENT = 4, // 装备
    MONEY = 5,     // 金钱
    CONTAINER = 6, // 容器
    CORPSE = 7,    // 尸体
    FOOD = 8,      // 食物
}
