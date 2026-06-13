// ============================================================
// 游戏属性类型定义
// ============================================================

/**
 * 基础属性常量 — 每个属性的中文说明。
 * 使用时可通过 `BASE_PROP.str` 查看注释，也可用 `BasePropKey` 做类型约束。
 */
export const BASE_PROP = {
    /** 臂力 */          str: '臂力',
    /** 根骨 */          con: '根骨',
    /** 身法 */          dex: '身法',
    /** 悟性 */          int: '悟性',
    /** 容貌 */          per: '容貌',
    /** 福缘 */          kar: '福缘',
    /** 年龄 */          age: '年龄',
    /** 性别 */          gender: '性别',
} as const;
/** 基础属性 key */
export type BasePropKey = keyof typeof BASE_PROP;

/**
 * 战斗属性常量 — 每个属性的中文说明。
 * 使用时可通过 `COMBAT_PROP.gj` 查看注释。
 */
export const COMBAT_PROP = {
    /** 当前气血 */      hp: '当前气血',
    /** 最大气血 */      max_hp: '最大气血',
    /** 当前内力 */      mp: '当前内力',
    /** 最大内力 */      max_mp: '最大内力',
    /** 攻击力 */        gj: '攻击力',
    /** 防御力 */        fy: '防御力',
    /** 命中 */          mz: '命中',
    /** 躲闪 */          ds: '躲闪',
    /** 招架 */          zj: '招架',
    /** 暴击 */          bj: '暴击',
    /** 攻击速度 */      gjsd: '攻击速度',
    /** 防御速度 */      fysd: '防御速度',
    /** 命中速度 */      mzsd: '命中速度',
    /** 躲闪速度 */      dssd: '躲闪速度',
} as const;
/** 战斗属性 key */
export type CombatPropKey = keyof typeof COMBAT_PROP;

/**
 * 百分比属性常量 — 每个属性的中文说明。
 * 使用时可通过 `PERCENT_PROP.fy_per` 查看注释。
 */
export const PERCENT_PROP = {
    /** 气血百分比加成 */        hp_per: '气血百分比加成',
    /** 内力百分比加成 */        mp_per: '内力百分比加成',
    /** 攻击力百分比加成 */      gj_per: '攻击力百分比加成',
    /** 防御力百分比加成 */      fy_per: '防御力百分比加成',
    /** 命中百分比加成 */        mz_per: '命中百分比加成',
    /** 躲闪百分比加成 */        ds_per: '躲闪百分比加成',
    /** 招架百分比加成 */        zj_per: '招架百分比加成',
    /** 暴击百分比加成 */        bj_per: '暴击百分比加成',
    /** 攻击速度百分比加成 */    gjsd_per: '攻击速度百分比加成',
    /** 经验获取百分比加成 */    exp_per: '经验获取百分比加成',
    /** 潜能获取百分比加成 */    pot_per: '潜能获取百分比加成',
    /** 内力加力上限 */          limit_mp: '内力加力上限',
    /** 内功抗性/减免 */         force_rad: '内功抗性/减免',
} as const;
/** 百分比属性 key */
export type PercentPropKey = keyof typeof PERCENT_PROP;

/**
 * 特殊属性常量 — 每个属性的中文说明。
 * 使用时可通过 `SPECIAL_PROP.ignore_fy` 查看注释。
 */
export const SPECIAL_PROP = {
    /** 伤害差值（直接加减伤） */              diff_sh: '伤害差值（直接加减伤）',
    /** 伤害差值百分比 */                      diff_sh_per: '伤害差值百分比',
    /** 二次伤害差值百分比 */                  diff_sh_per2: '二次伤害差值百分比',
    /** 二次防御差值百分比 */                  diff_fy_per2: '二次防御差值百分比',
    /** 忽视防御 */                            ignore_fy: '忽视防御',
    /** 忽视躲闪（无视对方闪避概率） */        ignore_mz: '忽视躲闪（无视对方闪避概率）',
    /** 额外攻击次数 */                        attack_num: '额外攻击次数',
    /** 经验获取加成（数值） */                exp_add: '经验获取加成（数值）',
    /** 潜能获取加成（数值） */                pot_add: '潜能获取加成（数值）',
    /** 积分获取加成（数值） */                score_add: '积分获取加成（数值）',
    /** 每秒自动回血 */                        auto_hp: '每秒自动回血',
    /** 每秒自动回内 */                        auto_mp: '每秒自动回内',
    /** 护体（护体真气/罡气） */               obs: '护体（护体真气/罡气）',
    /** 护盾值 */                              shield: '护盾值',
    /** 伤害百分比加成 */                      damage_per: '伤害百分比加成',
    /** 技能伤害加成 */                        skill_damage: '技能伤害加成',
    /** 减伤（最终伤害减免） */                reduce_damage: '减伤（最终伤害减免）',
    /** 背包最大容量 */                        max_item_count: '背包最大容量',
} as const;
/** 特殊属性 key */
export type SpecialPropKey = keyof typeof SPECIAL_PROP;

/** 所有已知属性 key 的联合类型 */
export type KnownPropKey =
    | BasePropKey
    | CombatPropKey
    | PercentPropKey
    | SpecialPropKey;

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

    // ===== 特殊属性 =====
    /** 伤害差值（直接加减伤） */ diff_sh?: number;
    /** 伤害差值百分比 */ diff_sh_per?: number;
    /** 二次伤害差值百分比 */ diff_sh_per2?: number;
    /** 二次防御差值百分比 */ diff_fy_per2?: number;
    /** 忽视防御 */ ignore_fy?: number;
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
