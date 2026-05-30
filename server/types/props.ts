// ============================================================
// 游戏属性类型定义
// ============================================================

/** 基础属性 key (str/dex/int 等主属性) */
export type BasePropKey =
  | 'str' | 'con' | 'dex' | 'int' | 'per' | 'kar'
  | 'age' | 'gender';

/** 战斗属性 key */
export type CombatPropKey =
  | 'hp' | 'max_hp' | 'mp' | 'max_mp'
  | 'gj' | 'fy' | 'mz' | 'ds' | 'zj' | 'bj'
  | 'gjsd' | 'fysd' | 'mzsd' | 'dssd';

/** 百分比属性 key */
export type PercentPropKey =
  | 'hp_per' | 'mp_per' | 'gj_per' | 'fy_per'
  | 'mz_per' | 'ds_per' | 'zj_per' | 'bj_per'
  | 'gjsd_per' | 'exp_per' | 'pot_per'
  | 'limit_mp' | 'force_rad';

/** 特殊属性 key */
export type SpecialPropKey =
  | 'diff_sh' | 'diff_sh_per' | 'diff_sh_per2'
  | 'diff_fy_per2' | 'ignore_fy' | 'ignore_mz'
  | 'attack_num' | 'exp_add' | 'pot_add' | 'score_add'
  | 'auto_hp' | 'auto_mp'
  | 'obs' | 'shield' | 'damage_per'
  | 'skill_damage' | 'reduce_damage'
  | 'max_item_count';

/** 所有已知属性 key 的联合类型 */
export type KnownPropKey =
  | BasePropKey
  | CombatPropKey
  | PercentPropKey
  | SpecialPropKey;

/**
 * 属性映射 — 键为属性名，值为数值。
 * 使用 KnownPropKey | string 以允许资源文件添加自定义属性，
 * 同时为已知 key 提供自动补全。
 */
export type PropMap = Partial<Record<KnownPropKey, number>> & Record<string, number | undefined>;

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
  SKILL = 0,
  FORCE = 1,
  DODGE = 2,
  UNARMED = 3,
  PARRY = 4,
  SWORD = 5,
  BLADE = 6,
  STAFF = 7,
  CLUB = 8,
  THROWING = 9,
  WHIP = 10,
  COMMON = 11,
}

/** 装备类型常量 */
export const enum EquipType {
  WEAPON = 0,
  CLOTH = 1,
  HEAD = 2,
  NECK = 3,
  WRIST = 4,
  HAND = 5,
  RING = 6,
  WAIST = 7,
  BOOT = 8,
  ARMOR = 9,
  FACE = 10,
}

/** 物品类型 */
export const enum ObjType {
  NORMAL = 0,
  DRUG = 1,
  BOOK = 2,
  EQUIPMENT = 4,
  MONEY = 5,
  CONTAINER = 6,
  CORPSE = 7,
  FOOD = 8,
}
