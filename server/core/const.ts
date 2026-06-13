// ============================================================
// 常量定义 — 技能类型、装备类型、武器类型、属性名称等
// ============================================================

/**
 * 技能类型映射
 */
export const SKILL_TYPES: Record<string, number> = {
    BASE: 0,  // 基础技能
    SKILL: 1,  // 特殊技能
    KNOWLEDGE: 2  // 知识类技能
};

/**
 * 基本技能 ID 常量
 */
export const BASE_SKILLS: Record<string, string>  = {
    FORCE: "force",   // 基本内功
    DODGE: "dodge",   // 基本轻功
    PARRY: "parry",   // 基本招架
    BITE: "bite",     // 基本拳脚
};

/**
 * 装备类型枚举
 */
export const EQUIP_TYPE: Record<string, number> = {
    WEAPON: 0,      // 武器
    CLOTH: 1,       // 护甲/衣服
    SHOES: 2,       // 鞋子
    HEAD: 3,        // 头饰/头盔
    CAPE: 4,        // 披风
    RING: 5,        // 戒指
    NECKLACE: 6,    // 项链
    JEWELS: 7,      // 饰品/珠宝
    WRIST: 8,       // 护腕
    WAIST: 9,       // 腰带
    THROWING: 10,   // 暗器
};

/**
 * 武器类型常量（映射到技能 ID）
 */
export const WEAPON_TYPE: Record<string, string> = {
    NONE: "unarmed",       // 空手（无武器）
    SWORD: "sword",        // 剑
    BLADE: "blade",        // 刀
    STAFF: "staff",        // 杖
    CLUB: "club",          // 棍
    WHIP: "whip",          // 鞭
    THROWING: "throwing",  // 暗器
};

/**
 * 属性名称映射表 — key 为属性内部标识，value 为中文显示名
 */
export const PROPERTIES: Record<string, string> = {
    // —— 先天属性（角色创建时随机，不可后天改变） ——
    "con1": "先天根骨",       // 影响气血成长和防御
    "dex1": "先天身法",       // 影响躲闪和攻击速度
    "int1": "先天悟性",       // 影响学习和修炼效率
    "str1": "先天臂力",       // 影响攻击伤害
    // —— 后天属性（受装备、技能等加成） ——
    "con": "根骨",
    "dex": "身法",
    "int": "悟性",
    "str": "臂力",
    // —— 基础战斗属性 ——
    "fy": "防御",             // 固定值防御
    "per": "容貌",            // 容貌（影响部分 NPC 互动）
    "age": "年龄",
    "gj": "攻击",             // 固定值攻击
    "ds": "躲闪",             // 固定值躲闪
    "zj": "招架",             // 固定值招架
    "mz": "命中",             // 固定值命中
    "bj_per": "暴击",         // 暴击率百分比
    "limit_mp": "内力上限",
    "gjsd": "攻击速度",       // 固定值攻速
    "gjsd_per": "攻击速度",   // 攻速百分比加成
    "mz_per": "命中",         // 命中率百分比加成
    // —— 气血 & 内力 ——
    "max_hp": "气血",
    "max_mp": "内力",
    // —— 绝招相关 ——
    "releasetime": "绝招释放时间",
    "distime": "绝招冷却时间",
    "expend_mp": "内力消耗",
    "releasetime_per": "绝招释放时间",   // 百分比加成
    "distime_per": "绝招冷却时间",       // 百分比加成
    "expend_mp_per": "内力消耗",         // 百分比加成
    // —— 伤害 & 减免 ——
    "add_sh_per": "最终伤害",            // 最终伤害百分比加成
    "add_bjsh_per": "暴击伤害",          // 暴击伤害百分比加成
    "diff_sh_per": "伤害减免",           // 百分比伤害减免
    "diff_sh": "受到的伤害减少",         // 固定值伤害减免
    "diff_fy_per": "忽视对方防御",       // 忽视防御百分比
    "fy_per": "防御",                    // 防御百分比加成
    "zj_per": "招架",                    // 招架百分比加成
    "gj_per": "攻击",                    // 攻击百分比加成
    "ds_per": "躲闪",                    // 躲闪百分比加成
    "hp_per": "气血",                    // 气血百分比加成
    // —— 修炼效率 ——
    "study_per": "学习效率",
    "dazuo_per": "打坐效率",            // 百分比加成
    "lianxi_per": "练习效率",
    "dazuo": "打坐效率",                // 固定值
    // —— 忙乱 & 抵抗 ——
    "busy": "忙乱时间",
    "busy_per": "忙乱时间",
    "diff_busy": "忽视忙乱",            // 减少忙乱时间（固定值）
    "diff_busy_per": "忽视忙乱",        // 减少忙乱时间（百分比）
    "diff_bj": "暴击抵抗",
    "add_sh": "伤害增加",               // 固定值伤害增加
    "diff_downside": "负面状态抵抗",
    "diff_downside_per": "负面状态抵抗",
    "diff_sh_per2": "伤害减免",         // 第二套伤害减免（不同计算阶段）
    "diff_fy_per2": "伤害减免",         // 第二套伤害减免
    "recover_per": "疗伤效果",
    // —— 生活技能 ——
    "lianyao1": "炼药效率",
    "lianyao2": "丹药产出",
    "lianyao_exp_per": "炼药获得经验",
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
    // —— 特殊效果 ——
    "no_fy": "无法防御",       // 使目标无法防御
    "no_pfm": "禁止绝招",      // 使目标无法释放绝招
};
