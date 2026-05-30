// ============================================================
// 常量定义 — 技能类型、装备类型、武器类型、属性名称等
// ============================================================

/**
 * 技能类型映射
 */
export const SKILL_TYPES: Record<string, number> = {
    SKILL: 0,
    FORCE: 1,
    DODGE: 2,
    UNARMED: 3,
    PARRY: 4,
    SWORD: 5,
    BLADE: 6,
    STAFF: 7,
    CLUB: 8,
    THROWING: 9,
    WHIP: 10,
    COMMON: 11,
};

/**
 * 基本技能 ID 常量
 */
export const BASE_SKILLS: Record<string, string> = {
    FORCE: "force",
    DODGE: "dodge",
    PARRY: "parry",
    BITE: "bite",
};

/**
 * 装备类型枚举
 */
export const EQUIP_TYPE: Record<string, number> = {
    WEAPON: 0,
    CLOTH: 1,
    HEAD: 2,
    NECK: 3,
    WRIST: 4,
    HAND: 5,
    RING: 6,
    WAIST: 7,
    BOOT: 8,
    ARMOR: 9,
    FACE: 10,
};

/**
 * 武器类型常量（映射到技能 ID）
 */
export const WEAPON_TYPE: Record<string, string> = {
    NONE: "unarmed",
    SWORD: "sword",
    BLADE: "blade",
    STAFF: "staff",
    CLUB: "club",
    WHIP: "whip",
    THROWING: "throwing",
};

/**
 * 属性名称映射表 — key 为属性内部标识，value 为中文显示名
 */
export const PROPERTIES: Record<string, string> = {
    "con1": "先天根骨",
    "dex1": "先天身法",
    "int1": "先天悟性",
    "str1": "先天臂力",
    "con": "根骨",
    "dex": "身法",
    "int": "悟性",
    "str": "臂力",
    "fy": "防御",
    "per": "容貌",
    "age": "年龄",
    "gj": "攻击",
    "ds": "躲闪",
    "zj": "招架",
    "mz": "命中",
    "bj_per": "暴击",
    "limit_mp": "内力上限",
    "gjsd": "攻击速度",
    "gjsd_per": "攻击速度",
    "mz_per": "命中",
    "max_hp": "气血",
    "max_mp": "内力",
    "releasetime": "绝招释放时间",
    "distime": "绝招冷却时间",
    "expend_mp": "内力消耗",
    "releasetime_per": "绝招释放时间",
    "distime_per": "绝招冷却时间",
    "expend_mp_per": "内力消耗",
    "add_sh_per": "最终伤害",
    "add_bjsh_per": "暴击伤害",
    "diff_sh_per": "伤害减免",
    "diff_sh": "受到的伤害减少",
    "diff_fy_per": "忽视对方防御",
    "fy_per": "防御",
    "zj_per": "招架",
    "gj_per": "攻击",
    "ds_per": "躲闪",
    "hp_per": "气血",
    "study_per": "学习效率",
    "dazuo_per": "打坐效率",
    "lianxi_per": "练习效率",
    "busy": "忙乱时间",
    "busy_per": "忙乱时间",
    "diff_busy": "忽视忙乱",
    "diff_busy_per": "忽视忙乱",
    "diff_bj": "暴击抵抗",
    "add_sh": "伤害增加",
    "diff_downside": "负面状态抵抗",
    "diff_downside_per": "负面状态抵抗",
    "dazuo": "打坐效率",
    "diff_sh_per2": "伤害减免",
    "diff_fy_per2": "伤害减免",
    "recover_per": "疗伤效果",
    "lianyao1": "炼药效率",
    "lianyao2": "丹药产出",
    "lianyao_exp_per": "炼药获得经验",
    "no_fy": "无法防御",
    "no_pfm": "禁止绝招",
    "kuang_exp": "挖矿经验",
    "kuang_pot": "挖矿潜能",
    "diaoyu_exp": "钓鱼经验",
    "diaoyu_pot": "钓鱼潜能",
    "diaoyu1": "钓鱼效率",
    "kuang1": "挖矿效率",
    "caiyao1": "采药效率",
    "caiyao_exp": "采药经验",
    "caiyao_pot": "采药潜能",
    "xiulian_exp": "闭关经验",
    "shuangxiu": "双修效率",
    "fenjie": "分解获得的玄晶",
};
