/**
 * 常量定义 — 技能类型、装备类型、武器类型、属性名称等
 */

/**
 * 技能类型映射
 */
export const SKILL_TYPES = {
    /** 基础技能 */
    BASE: 0,
    /** 特殊技能 */
    SKILL: 1,
    /** 知识类技能 */
    KNOWLEDGE: 2,
};

/**
 * 基本技能 ID 常量
 */
export const BASE_SKILLS = {
    /** 基本内功 */
    FORCE: 'force',
    /** 基本轻功 */
    DODGE: 'dodge',
    /** 基本招架 */
    PARRY: 'parry',
    /** 野兽叮咬 */
    BITE: 'bite',
};

/**
 * 装备类型枚举
 */
export const EQUIP_TYPE = {
    /** 武器 */
    WEAPON: 0,
    /** 护甲/衣服 */
    CLOTH: 1,
    /** 鞋子 */ SHOES: 2,
    /** 头饰/头盔 */
    HEAD: 3,
    /** 披风 */
    CAPE: 4,
    /** 戒指 */
    RING: 5,
    /** 项链 */
    NECKLACE: 6,
    /** 饰品/珠宝 */
    JEWELS: 7,
    /** 护腕 */
    WRIST: 8,
    /** 腰带 */
    WAIST: 9,
    /** 暗器 */
    THROWING: 10,
};

/**
 * 武器类型常量（映射到技能 ID）
 */
export const WEAPON_TYPE = {
    /** 空手（无武器） */
    NONE: 'unarmed',
    /** 拳脚（有武器） */
    UNARMED: 'unarmed',
    /** 剑 */
    SWORD: 'sword',
    /** 刀 */
    BLADE: 'blade',
    /** 杖 */
    STAFF: 'staff',
    /** 棍 */
    CLUB: 'club',
    /** 鞭 */
    WHIP: 'whip',
    /** 暗器 */
    THROWING: 'throwing',
};

/**
 * 武器技能类型集合 — 装备为这些基本技能时需持有对应类型的武器
 */
export const WEAPON_SKILLS: ReadonlySet<string> = new Set([
    'sword',
    'blade',
    'staff',
    'club',
    'whip',
]);

/**
 * 属性名称映射表 — key 为属性内部标识，value 为中文显示名
 */
export const PROPERTIES = {
    // —— 先天属性（角色创建时随机，不可后天改变） ——
    /** 先天根骨 — 影响气血成长和防御 */
    con1: '先天根骨',
    /** 先天身法 — 影响躲闪和攻击速度 */
    dex1: '先天身法',
    /** 先天悟性 — 影响学习和修炼效率 */
    int1: '先天悟性',
    /** 先天臂力 — 影响攻击伤害 */
    str1: '先天臂力',
    // —— 后天属性（受装备、技能等加成） ——
    /** 根骨 */
    con: '根骨',
    /** 身法 */
    dex: '身法',
    /** 悟性 */
    int: '悟性',
    /** 臂力 */
    str: '臂力',
    // —— 基础战斗属性 ——
    /** 防御 — 固定值防御 */
    fy: '防御',
    /** 容貌 — 影响部分 NPC 互动 */
    per: '容貌',
    /** 年龄 */
    age: '年龄',
    /** 攻击 — 固定值攻击 */
    gj: '攻击',
    /** 躲闪 — 固定值躲闪 */
    ds: '躲闪',
    /** 招架 — 固定值招架 */
    zj: '招架',
    /** 命中 — 固定值命中 */
    mz: '命中',
    /** 暴击 — 暴击率百分比 */
    bj_per: '暴击',
    /** 内力上限 */
    limit_mp: '内力上限',
    /** 攻击速度 — 固定值攻速 */
    gjsd: '攻击速度',
    /** 攻击速度 — 攻速百分比加成 */
    gjsd_per: '攻击速度',
    /** 命中 — 命中率百分比加成 */
    mz_per: '命中',
    // —— 气血 & 内力 ——
    /** 气血 */
    max_hp: '气血',
    /** 内力 */
    max_mp: '内力',
    // —— 绝招相关 ——
    /** 绝招释放时间 */
    releasetime: '绝招释放时间',
    /** 绝招冷却时间 */
    distime: '绝招冷却时间',
    /** 内力消耗 */
    expend_mp: '内力消耗',
    /** 绝招释放时间 — 百分比加成 */
    releasetime_per: '绝招释放时间',
    /** 绝招冷却时间 — 百分比加成 */
    distime_per: '绝招冷却时间',
    /** 内力消耗 — 百分比加成 */
    expend_mp_per: '内力消耗',
    // —— 伤害 & 减免 ——
    /** 最终伤害 — 最终伤害百分比加成 */
    add_sh_per: '最终伤害',
    /** 暴击伤害 — 暴击伤害百分比加成 */
    add_bjsh_per: '暴击伤害',
    /** 伤害减免 — 百分比伤害减免 */
    diff_sh_per: '伤害减免',
    /** 受到的伤害减少 — 固定值伤害减免 */
    diff_sh: '受到的伤害减少',
    /** 忽视对方防御 — 忽视防御百分比 */
    diff_fy_per: '忽视对方防御',
    /** 防御 — 防御百分比加成 */
    fy_per: '防御',
    /** 招架 — 招架百分比加成 */
    zj_per: '招架',
    /** 攻击 — 攻击百分比加成 */
    gj_per: '攻击',
    /** 躲闪 — 躲闪百分比加成 */
    ds_per: '躲闪',
    /** 气血 — 气血百分比加成 */
    hp_per: '气血',
    // —— 修炼效率 ——
    /** 学习效率 */
    study_per: '学习效率',
    /** 打坐效率 — 百分比加成 */
    dazuo_per: '打坐效率',
    /** 练习效率 */
    lianxi_per: '练习效率',
    /** 打坐效率 — 固定值 */
    dazuo: '打坐效率',
    // —— 忙乱 & 抵抗 ——
    /** 忙乱时间 */
    busy: '忙乱时间',
    /** 忙乱时间（百分比） */
    busy_per: '忙乱时间',
    /** 忽视忙乱 — 减少忙乱时间（固定值） */
    diff_busy: '忽视忙乱',
    /** 忽视忙乱 — 减少忙乱时间（百分比） */
    diff_busy_per: '忽视忙乱',
    /** 暴击抵抗 */
    diff_bj: '暴击抵抗',
    /** 伤害增加 — 固定值伤害增加 */
    add_sh: '伤害增加',
    /** 负面状态抵抗 */
    diff_downside: '负面状态抵抗',
    /** 负面状态抵抗（百分比） */
    diff_downside_per: '负面状态抵抗',
    /** 伤害减免 — 第二套伤害减免（不同计算阶段） */
    diff_sh_per2: '伤害减免',
    /** 忽视对方防御 — 第二套伤害减免 */
    diff_fy_per2: '忽视对方防御',
    /** 疗伤效果 */
    recover_per: '疗伤效果',
    // —— 生活技能 ——
    /** 炼药效率 */
    lianyao1: '炼药效率',
    /** 丹药产出 */
    lianyao2: '丹药产出',
    /** 炼药获得经验 */
    lianyao_exp_per: '炼药获得经验',
    /** 挖矿经验 */
    kuang_exp: '挖矿经验',
    /** 挖矿潜能 */
    kuang_pot: '挖矿潜能',
    /** 钓鱼经验 */
    diaoyu_exp: '钓鱼经验',
    /** 钓鱼潜能 */
    diaoyu_pot: '钓鱼潜能',
    /** 钓鱼效率 */
    diaoyu1: '钓鱼效率',
    /** 挖矿效率 */
    kuang1: '挖矿效率',
    /** 采药效率 */
    caiyao1: '采药效率',
    /** 采药经验 */
    caiyao_exp: '采药经验',
    /** 采药潜能 */
    caiyao_pot: '采药潜能',
    /** 闭关经验 */
    xiulian_exp: '闭关经验',
    /** 双修效率 */
    shuangxiu: '双修效率',
    /** 分解获得的玄晶 */
    fenjie: '分解获得的玄晶',
    // —— 特殊效果 ——
    /** 无法防御 — 使目标无法防御 */
    no_fy: '无法防御',
    /** 禁止绝招 — 使目标无法释放绝招 */
    no_pfm: '禁止绝招',
};

export const PfmFlag = {
    /** 阻止继续释放绝招的流程，表现为根本放不出来，不会进入冷却 */
    BLOCK: 1 << 0, // 0b0001
    /** 阻止释放绝招产生效果，扣蓝cd不生效 */
    NO_USE: 1 << 1, // 0b0010
    /** 消耗效果 */
    EXPEND_STATU: 1 << 3, // 0b0010
} as const; // 提取所有标记联合类型，强类型校验
/**
 * 品级颜色标签 — 按 grade 索引: 0=普通(wht) 1=精良(hig) 2=高级(hic) 3=稀有(hiy) 4=绝世(HIZ) 5=传说(hio) 6=神器(ord)
 */
export const GRADE_COLORS = ['wht', 'hig', 'hic', 'hiy', 'HIZ', 'hio', 'ord'];

/**
 * 可恢复记录类型 (WORLD.add_recover_obj)
 */
export const RecoverType = {
    /** 丢弃物品 */
    DROP: 0,
    /** 出售物品 */
    SELL: 1,
    /** 分解物品 */
    FENJIE: 2,
    /** 遗忘技能 */
    FORGET_SKILL: 3,
    /** 商店回购 */
    SHOP_BUYBACK: 12,
} as const;
export type RecoverType = (typeof RecoverType)[keyof typeof RecoverType];
