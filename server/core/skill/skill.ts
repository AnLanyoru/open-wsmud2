/**
 * SKILL 技能基类 & PERFORM 绝招类
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";
import { UTIL } from "../util.js";
import { FAMILIES } from "./family.js";
import type { FAMILY } from './family.js';
import type { CHARACTER } from '../char/character.js';

/**
 * query_enable_prop 内层返回值：属性名→加成数值
 * 这些属性通过 change_prop → add_prop 写入角色 prop 字典，由 recount() 读取计算六大战斗属性
 */
export interface EnablePropValues {
    /** 攻击力 */
    gj?: number;
    /** 攻击力百分比 */
    gj_per?: number;
    /** 命中值 */
    mz?: number;
    /** 命中值百分比 */
    mz_per?: number;
    /** 防御力 */
    fy?: number;
    /** 防御力百分比 */
    fy_per?: number;
    /** 闪避值 */
    ds?: number;
    /** 闪避值百分比 */
    ds_per?: number;
    /** 招架值 */
    zj?: number;
    /** 招架值百分比 */
    zj_per?: number;
    /** 臂力 */
    str?: number;
    /** 身法 */
    dex?: number;
    /** 根骨 */
    con?: number;
    /** 悟性 */
    int?: number;
    /** 暴击率百分比 */
    bj_per?: number;
    /** 攻击速度(减少延迟ms) */
    gjsd?: number;
    /** 攻击速度百分比 */
    gjsd_per?: number;
    /** 最大气血 */
    max_hp?: number;
    /** 最大内力 */
    max_mp?: number;
    /** 内力上限(独立于max_mp，由内功加成) */
    limit_mp?: number;
    /** 附加伤害百分比 */
    add_sh_per?: number;
    /** 伤害减免百分比 */
    diff_sh_per?: number;
    /** 忽视目标防御百分比 */
    diff_fy_per?: number;
    /** 描述文字(仅展示，不参与属性计算) */
    desc?: string;
}

/** query_enable_prop 返回值：按基本技能类型分组的属性加成字典 */
export interface EnablePropMap {
    /** 空手技能 */
    unarmed?: EnablePropValues;
    /** 招架技能 */
    parry?: EnablePropValues;
    /** 内功技能 */
    force?: EnablePropValues;
    /** 轻功技能 */
    dodge?: EnablePropValues;
    /** 剑法技能 */
    sword?: EnablePropValues;
    /** 刀法技能 */
    blade?: EnablePropValues;
    /** 杖法技能 */
    staff?: EnablePropValues;
    /** 棍法技能 */
    club?: EnablePropValues;
    /** 鞭法技能 */
    whip?: EnablePropValues;
    /** 暗器技能 */
    throwing?: EnablePropValues;
    /** 噬咬技能(怪物专用) */
    bite?: EnablePropValues;
    /** 允许 for...in 动态遍历时的字符串索引 */
    [key: string]: EnablePropValues | undefined;
}

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

/** 技能学习条件 */
export interface LearnCondition {
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
    /** 其他角色属性阈值(如门派贡献、等级等) 自己写新的，别乱用any */
}

// 从 os/const.js 导入常量
// 注意: 这些常量应被迁移到 server/core/const.ts
const SKILL_TYPES = { BASE: 0, SKILL: 1, KNOWLEDGE: 2 } as const;
const PROPERTIES: Record<string, string> = {};

/** 品级颜色 */
const level_color = ["wht", "hig", "hic", "hiy", "hiz", "hio", "ord"];
/** 品级描述 */
const level_desc = ["基本技能", "普通技能", "高级技能", "稀有武技", "绝世武功", "绝世神功", "无上神武"];

// ============================================================
// SKILL 技能类
// ============================================================

export class SKILL extends BASE {

    // ============ 核心属性 ============

    /** 技能ID */
    id: string = "";
    /** 技能名称 */
    name: string = "";
    /** 技能类型: SKILL_TYPES.{BASE, SKILL, KNOWLEDGE} */
    type: number = SKILL_TYPES.SKILL;
    /** 技能品级(1-6) */
    grade: number = 1;
    /** 技能评分 */
    score: number = 0;
    /**
     * 技能学习条件，可包含以下字段:
     * - skill: {[id: string]: number}  前置技能ID→等级要求
     * - str1/con1/dex1/int1: number    先天属性(不含装备加成)
     * - str/con/dex/int: number        总属性(含装备加成)
     * - gender: number                 性别要求(1男/2女/3无性)
     * - desc: string                   条件描述(仅展示,不做检查)
     * - 其他任意key: number            角色属性阈值
     */
    learn_condition?: LearnCondition;

    // ============ 动作描述(支持$占位符) ============

    /** 攻击动作 */
    attack_actions: string[] = [];
    /** 闪避动作 */
    dodge_actions: string[] = [];
    /** 招架动作 */
    parry_actions: string[] = [];
    /** 武器对武器招架 */
    weapon_vs_weapon_actions: string[] = [];
    /** 武器对空手招架 */
    weapon_vs_unarmed_actions: string[] = [];
    /** 空手对武器招架 */
    unarmed_vs_weapon_actions: string[] = [];

    // ============ 运行时/资源文件设置属性 ============

    /** 技能描述 */
    desc: string = "";
    /** 技能被移除时回调 — 触发时机：玩家 remove_skill() 末尾，技能属性已释放、从技能表删除后 */
    on_remove?: (me: CHARACTER, skill: SKILL | null) => boolean | void;

    // ============ 绝招与技能槽 ============

    /** 绝招字典(由资源文件设置) */
    pfm?: Record<string, PERFORM>;
    /** 进阶属性槽位(由资源文件设置) */
    slots: any[] | null = null;

    // ============ 配置属性(由资源文件设置) ============

    /** 可装备的基本技能类型列表 */
    can_enables: string[] = [];
    /** 所属门派 */
    family?: FAMILY;
    /** 源技能(进阶来源) */
    source_skill?: string;
    /** 是否为终极技能 */
    is_ultimate?: boolean;
    /** 是否隐藏 */
    is_hidden?: boolean;
    /** 是否为自创武功（由 checkskill 等系统检查） */
    is_custom?: boolean;
    /** 可练习的最低等级（由 lianxi 命令使用） */
    lianxi_level?: number;
    /** 技能颜色名称缓存 */
    color_name: string = "";
    /** 学习条件字符串缓存 */
    learn_condition_string?: string;

    // ============ 回调（由资源文件设置） ============

    /** 激活技能回调 — 触发时机：enable() 开头，技能装备到基本技能类型时；返回 false 阻止激活 */
    on_enable?: (me: CHARACTER, type: string) => boolean | void;
    /** 取消激活回调 — 触发时机：disenable() 开头，技能从基本技能类型卸下时 */
    on_disenable(me: CHARACTER, type: string): void { }
    /** 学习技能回调 — 触发时机：玩家执行学习命令时（do_learn() 开头）；返回 false 阻止学习 */
    on_learn(me: CHARACTER): boolean | void { return; }
    /** 练习技能回调 — 触发时机：lianxi 命令执行时检查；返回 false 阻止练习 */
    on_practice?(me: CHARACTER): boolean | void;
    /** 查询激活属性 — 触发时机：装备/卸下技能计算属性加成时 */
    query_enable_prop(lv: number, me?: CHARACTER): EnablePropMap | undefined { return undefined; }
    /** 查询基础属性 — 触发时机：装备/卸下/升级技能计算属性加成时 */
    query_prop(lv: number, me?: CHARACTER): Record<string, any> | undefined { return undefined; }
    /** 敌人死亡回调 — 触发时机：NPC/MONSTER die() 末尾，killer.attack_skill.on_enemy_die 调用时 */
    on_enemy_die?: (me: CHARACTER, target: CHARACTER) => void;

    // ============ 战斗回调（由资源文件设置） ============

    /** 战斗开始回调 */
    on_beginfight?: (me: CHARACTER, target: CHARACTER) => void;
    /** 攻击前回调（每轮） */
    on_before_attack?: (me: CHARACTER, target: CHARACTER, par: Record<string, any>) => void;
    /** 攻击回调（返回额外伤害） */
    on_attack(me: CHARACTER, target: CHARACTER, par: Record<string, any>): number { return 0; }
    /** 攻击结束回调（一轮后） */
    on_attack_over(me: CHARACTER, target: CHARACTER, par: Record<string, any>, sh: number): void { }
    /** 一轮攻击完全结束回调 */
    on_end_attack?: (me: CHARACTER, target: CHARACTER) => void;
    /** 内功攻击回调（返回内功伤害） */
    do_force_attack(me: CHARACTER, target: CHARACTER, par: Record<string, any>): number { return 0; }
    /** 内功招架回调（返回减免伤害） */
    on_force_parry(target: CHARACTER, me: CHARACTER, sh: number, par: Record<string, any>): number { return 0; }
    /** 内功攻击结束回调 */
    on_force_over?: (me: CHARACTER, target: CHARACTER, par: Record<string, any>, sh: number) => void;
    /** 受到伤害回调（返回减免后伤害） */
    on_damage?: (me: CHARACTER, from: CHARACTER, sh: number) => number;
    /** 闪避回调 */
    on_dodge?: (target: CHARACTER, me: CHARACTER, par: Record<string, any>) => void;
    /** 闪避结束回调 */
    on_dodge_over(target: CHARACTER, me: CHARACTER, par: Record<string, any>): void { }
    /** 招架回调 */
    on_parry?: (target: CHARACTER, me: CHARACTER, par: Record<string, any>) => void;
    /** 招架结束回调 */
    on_parry_over(target: CHARACTER, me: CHARACTER, par: Record<string, any>): void { }
    /** 绝招招架回调（返回是否招架成功） */
    on_parry_pfm?: (target: CHARACTER, me: CHARACTER, pfm: Record<string, any>, level: number) => boolean;
    /** 重算闪避回调（由资源文件动态注入） */
    on_recount_dodge?: (me: CHARACTER) => number;
    /** 重算招架回调（由资源文件动态注入） */
    on_recount_parry?: (me: CHARACTER) => number;
    /** 内功加成比例 */
    force_rad?: number;
    /** 复活回调（由 biwu 等系统动态注入） */
    on_relive?: (me: CHARACTER) => void;

    constructor() {
        super();
    }

    // ============ 动作查询 ============

    /**
     * 获取攻击动作描述
     * @param me - 攻击者
     * @param target - 目标
     */
    query_attack_action(me: CHARACTER, target: CHARACTER): string {
        if (this.attack_actions)
            return this.attack_actions.random();
        return "";
    }

    /**
     * 获取闪避动作描述
     */
    query_dodge_action(): string {
        if (!this.dodge_actions) {
            return "";
        }
        return this.dodge_actions.random();
    }

    /**
     * 获取招架动作描述
     * @param me - 防御者
     * @param target - 攻击者
     * @param w2 - 攻击者武器
     */
    query_parry_action(me: CHARACTER, target: CHARACTER, w2?: Record<string, any>): string {
        const w1 = me.query_weapon();
        w2 = w2 || target.query_weapon();
        let act: string[] | undefined;
        if (w1 && w2) {
            act = this.weapon_vs_weapon_actions.length ? this.weapon_vs_weapon_actions : this.parry_actions;
        } else if (w1) {
            act = this.weapon_vs_unarmed_actions.length ? this.weapon_vs_unarmed_actions : this.parry_actions;
        } else if (w2) {
            act = this.unarmed_vs_weapon_actions.length ? this.unarmed_vs_weapon_actions : this.parry_actions;
        } else {
            act = this.parry_actions;
        }

        if (!act || !act.length) {
            const parrySkill = SKILL.get("parry");
            if (parrySkill) act = parrySkill.parry_actions;
        }

        if (act && act.length) {
            return act.random();
        }
        return "";
    }

    // ============ 经验与等级 ============

    /**
     * 查升级所需经验
     * @param lv - 当前等级
     * @param me
     */
    level_exp(lv: number, me?: CHARACTER): number {
        const grd = this.query_grade(me);
        return (lv + 1) * (grd + 1) * 5;
    }

    /**
     * 查询从100级到指定等级总需经验
     * @param level
     * @param me
     */
    query_needexp(level: number, me?: CHARACTER): number {
        if (level > 100) {
            const grd = this.query_grade(me);
            const exp = (100 + level) * (level - 100) / 2;
            return exp * (grd + 1) * 5;
        } else {
            return 0;
        }
    }

    // ============ 默认与属性 ============

    /**
     * 设置为默认技能
     * @param type - 基本技能类型
     */
    set_default(type: string): void {
        WORLD.DEFAULT_SKILLS[type] = this;
    }

    /**
     * 移除技能附加属性
     * @param me
     * @param lv - 技能等级
     */
    release_prop(me: CHARACTER, lv: number): void {
        if (!lv) return;
        const base_prop = this.query_prop(lv, me);
        if (base_prop) {
            me.change_prop(base_prop, false);
        }
        const enable_prop = this.query_enable_prop(lv, me);
        if (enable_prop) {
            for (let item in enable_prop) {
                if (me.is_enable_skill(this.id, item)) {
                    me.change_prop(enable_prop[item]!, false);
                }
            }
        }
        const addin_prop = this.query_addin_prop(me, lv);
        if (addin_prop) {
            if (this.is_enable(me)) {
                me.change_prop(addin_prop, false);
            }
        }
    }

    /**
     * 附加技能属性
     * @param me
     * @param lv
     */
    attach_prop(me: CHARACTER, lv: number): void {
        if (!lv) return;
        const base_prop = this.query_prop(lv, me);
        if (base_prop) {
            me.change_prop(base_prop, true);
        }
        const enable_prop = this.query_enable_prop(lv, me);
        if (enable_prop) {
            for (let item in enable_prop) {
                if (me.is_enable_skill(this.id, item)) {
                    me.change_prop(enable_prop[item]!, true);
                }
            }
        }
        const addin_prop = this.query_addin_prop(me, lv);
        if (addin_prop) {
            if (this.is_enable(me)) {
                me.change_prop(addin_prop, true);
            }
        }
    }

    // ============ 品级与颜色 ============

    /**
     * 查询技能品级(含进阶)
     * @param me
     */
    query_grade(me?: CHARACTER): number {
        if (!me) return this.grade;
        const sk = me.skills ? me.skills[this.id] : undefined;
        let lv = this.grade;
        if (sk) {
            if (sk.addin)
                lv += sk.addin.length;
            if (sk.ref)
                lv += 1;
        }
        return lv;
    }

    /**
     * 获取技能颜色名称
     * @param me
     */
    query_color_name(me?: CHARACTER): string {
        const desc = level_color[this.query_grade(me)] || "wht";
        return "<" + desc + ">" + this.name + "</" + desc + ">";
    }

    // ============ 进阶属性 ============

    /**
     * 查询进阶属性
     * @param me
     * @param lv
     */
    query_addin_prop(me: CHARACTER, lv: number): Record<string, number> | undefined {
        const sk = me.skills ? me.skills[this.id] : undefined;
        if (sk && sk.addin && sk.addin.length) {
            const prop: Record<string, number> = {};
            const grd = this.grade + sk.addin.length;
            for (let slot of sk.addin) {
                const item = this.query_slot(slot);
                if (!item) continue;
                if (item.prop) {
                    prop[item.prop] = (prop[item.prop] ?? 0)
                        + parseInt(item.value(lv, grd));
                }
            }
            return prop;
        }
        return undefined;
    }

    // ============ 技能启用/禁用 ============

    /**
     * 检查技能是否已装备到某个基本技能
     * @param me
     */
    is_enable(me: CHARACTER): boolean {
        if (this.type !== SKILL_TYPES.SKILL) return true;
        const skill = me.skills ? me.skills[this.id] : undefined;
        if (!skill || !this.can_enables) return false;
        for (let i = 0; i < this.can_enables.length; i++) {
            if (skill[this.can_enables[i]]) return true;
        }
        return false;
    }

    /**
     * 检查技能是否装备到指定基本技能
     * @param me
     * @param baseskill
     */
    is_enable2(me: CHARACTER, baseskill: string): boolean {
        const skill = me.skills ? me.skills[this.id] : undefined;
        return skill ? skill[baseskill] : false;
    }

    /**
     * 激活技能
     * @param me
     * @param type - 基本技能类型
     */
    enable(me: CHARACTER, type: string, _lv?: number): boolean {
        if (!this.can_enables || !this.can_enables.contain(type)) return false;
        if (this.on_enable && this.on_enable(me, type) === false) return false;
        const lv = me.query_skill(this.id);
        const enable_prop = this.query_enable_prop(lv, me);
        if (enable_prop) {
            const type_prop = enable_prop[type];
            if (type_prop) {
                me.change_prop(type_prop, true);
            }
        }
        const addin_prop = this.query_addin_prop(me, lv);
        if (addin_prop) {
            if (!this.is_enable(me)) {
                me.change_prop(addin_prop, true);
            }
        }
        return true;
    }

    /**
     * 取消激活技能
     * @param me
     * @param type
     */
    disenable(me: CHARACTER, type: string): boolean {
        this.on_disenable(me, type);
        const lv = me.query_skill(this.id);
        const enable_prop = this.query_enable_prop(lv, me);
        if (enable_prop) {
            const type_prop = enable_prop[type];
            if (type_prop) {
                me.change_prop(type_prop, false);
            }
        }

        const addin_prop = this.query_addin_prop(me, lv);
        if (addin_prop) {
            if (!this.is_enable(me)) {
                me.change_prop(addin_prop, false);
            }
        }
        return true;
    }

    // ============ 学习条件 ============

    /**
     * 检查并执行学习条件
     * @param me
     */
    do_learn(me: CHARACTER): boolean | undefined {
        if (this.on_learn(me) === false) return false;
        if (this.learn_condition) {
            for (let key in this.learn_condition) {
                const val = this.learn_condition[key];
                switch (key) {
                    case "skill":
                        for (let sk in val) {
                            if (me.query_skill(sk, 0) < val[sk] && me.query_skill(sk + "2", 0) < val[sk]) {
                                const sk_base = SKILL.get(sk);

                                return me.notify_fail("你的" + (sk_base ? sk_base.color_name : sk) + "等级不够" + val[sk] + "，无法学习" + this.color_name + "。");
                            }
                        }
                        break;
                    case "str1":
                    case "con1":
                    case "dex1":
                    case "int1":
                        if (me.is_player && me[key.replace("1", "")] < val) {
                            return me.notify_fail("你的" + (PROPERTIES[key] || key) + "不够" + val + "，无法学习" + this.color_name + "。");
                        }
                        break;
                    case "str":
                    case "con":
                    case "dex":
                    case "int":
                        if (me[key] + me.query_prop(key) < val) {
                            return me.notify_fail("你的" + (PROPERTIES[key] || key) + "不够" + val + "，无法学习" + this.color_name + "。");
                        }
                        break;
                    case "gender":
                        if (me.gender !== val) return me.notify_fail("你不是" + (val === 1 ? "男性" : val === 2 ? "女性" : "无性") + "，无法学习" + this.color_name + "。");
                        break;
                    case "desc":
                        break;
                    default:
                        let me_val = me[key] || 0;
                        me_val = me_val + me.query_prop(key);
                        if (!me_val || me_val < val) {
                            return me.notify_fail("你的" + (PROPERTIES[key] || key) + "不够" + val + "，无法学习" + this.color_name + "。");
                        }
                        break;
                }
            }
        } else {
            if (this.type === SKILL_TYPES.SKILL && this.can_enables) {
                for (let i = 0; i < this.can_enables.length; i++) {
                    if (!me.query_skill(this.can_enables[i], 0)) {
                        const skill = SKILL.get(this.can_enables[i]);
                        return me.notify_fail("你还不会" + (skill ? skill.color_name : this.can_enables[i]) + "，无法学习" + this.color_name + "。");
                    }
                }
            }
        }
        return true;
    }

    /**
     * 学习条件转字符串
     */
    condition_tostring(): string {
        if (this.learn_condition_string) return this.learn_condition_string;
        const str: string[] = [];
        if (this.learn_condition) {
            for (let key in this.learn_condition) {
                const val = this.learn_condition[key];
                switch (key) {
                    case "skill":
                        for (let sk in val) {
                            const sk_base = SKILL.get(sk);
                            str.push((sk_base ? sk_base.name : sk) + "：" + val[sk] + "级");
                        }
                        break;
                    case "desc":
                        str.push(val);
                        break;
                    case "gender":
                        str.push("性别：" + (val === 1 ? "男" : (val === 2 ? "女" : "无性")));
                        break;
                    default:
                        str.push((PROPERTIES[key] || key) + "：" + val);
                        break;
                }
            }
        }
        this.learn_condition_string = str.join("\n");
        return this.learn_condition_string;
    }

    // ============ JSON序列化 ============

    /**
     * 技能JSON序列化
     * @param str - 输出数组
     * @param skill_item - 技能数据
     * @param me
     */
    item_to_json(str: string[], skill_item: Record<string, any>, me: CHARACTER): void {
        str.push('{"id":"');
        str.push(this.id);

        str.push('","name":"');
        str.push(this.query_color_name(me));
        str.push('",grade:', String(this.query_grade(me)));
        str.push(',"level":');
        str.push(me.query_skill(this.id).toString());
        str.push(',"exp":');
        skill_item.exp = skill_item.exp || 0;
        str.push(String(parseInt(String(skill_item.exp * 100 / this.level_exp(skill_item.level, me)))));
        if (this.can_enables) {
            str.push(',"can_enables":[');
            for (let i = 0; i < this.can_enables.length; i++) {
                if (i > 0) str.push(",");
                str.push('"');
                str.push(this.can_enables[i]);
                str.push('"');
            }
            str.push(']');
        }

        if (skill_item.enable_skill) {
            str.push(',"enable_skill":"');
            str.push(skill_item.enable_skill);
            str.push('"');
        }
        str.push('}');
    }

    // ============ 技能经验 ============

    /**
     * 增加技能经验
     * @param me
     * @param exp
     */
    add_exp(me: CHARACTER, exp: number): boolean | undefined {
        if (!me.skills) me.skills = {};
        let skill = me.skills[this.id];
        if (!skill) {
            skill = {
                level: 0,
                exp: 0,
                enable_skill: null
            };
            const str: string[] = ['{type:"dialog",dialog:"skills",item:'];
            this.item_to_json(str, skill, me);
            str.push("}");
            me.notify(str.join(""));
            me.skills[this.id] = skill;
            if (this.type === SKILL_TYPES.BASE) {
                me.init_skill();
            }
        }
        let need_exp = this.level_exp(skill.level, me);
        skill.exp += exp;
        if (skill.exp >= need_exp) {
            this.release_prop(me, me.query_skill(this.id));
            let sum_score = 0;
            const color_name = this.query_color_name(me);
            const one_score = this.query_one_score(me);
            while (skill.exp >= need_exp) {
                skill.exp -= need_exp;
                need_exp = this.level_exp(skill.level, me);
                me.notify("<hiy>你的" + color_name + "等级提升了！</hiy>");
                skill.level++;
                if (skill.level > 100)
                    sum_score += one_score;
            }
            const lv = me.query_skill(this.id);
            this.attach_prop(me, lv);
            me.notify('{type:"dialog",dialog:"skills",id:"' + this.id + '",level:' + lv + ',exp:' + parseInt(String(skill.exp * 100 / need_exp)) + '}');
            me.recount();
            me.add_score(sum_score);
            return true;
        } else {
            me.notify('{type:"dialog",dialog:"skills",id:"' + this.id + '",exp:' + parseInt(String(skill.exp * 100 / need_exp)) + '}');
        }
    }

    // ============ 积分 ============

    /**
     * 查询技能总积分
     * @param lv
     * @param me
     */
    query_score(lv: number, me?: CHARACTER): number {
        if (lv <= 100) return 0;
        return (lv - 100) * this.query_one_score(me);
    }

    /**
     * 查询每级积分
     * @param me
     */
    query_one_score(me?: CHARACTER): number {
        let sc = 0;
        if (this.type === SKILL_TYPES.SKILL) {
            sc = this.query_grade(me);
        } else if (this.type === SKILL_TYPES.BASE) {
            sc = 1;
        }
        return sc;
    }

    // ============ 进阶 ============

    /**
     * 技能进阶
     * @param me
     * @param target_skill - 目标技能
     */
    grade_up(me: CHARACTER, target_skill: SKILL): boolean {
        if (!me.skills) return false;
        const skill = me.skills[this.id];
        if (!skill || !(skill.level >= 1000)) return false;

        if (me.remove_skill(this.id) === false) return false;
        me.notify('{type:"dialog",dialog:"skills",remove:"' + this.id + '"}');
        const pot = this.query_needexp(skill.level, me);
        const lv = pot * 2 / 5 / (target_skill.grade + 1);
        const newSkill: any = {
            level: parseInt(Math.pow(lv, 0.5)),
            exp: 0,
            enable_skill: null
        };
        me.skills[target_skill.id] = newSkill;
        const str: string[] = ['{type:"dialog",dialog:"skills",item:'];
        target_skill.item_to_json(str, newSkill, me);
        str.push("}");
        me.notify(str.join(""));
        me.add_score(target_skill.query_score(newSkill.level, me));
        target_skill.attach_prop(me, newSkill.level);
        me.recount();
        return true;
    }

    // ============ 绝招管理 ============

    /**
     * 获取绝招定义
     * @param name - 绝招名
     */
    get_pfm(name: string): PERFORM | undefined {
        if (this.pfm) {
            const entry = this.pfm[name];
            if (!entry) return undefined;
            if (entry instanceof PERFORM) return entry;
            return PERFORM.fromPlain(entry);
        }
        return undefined;
    }

    /**
     * 设置绝招
     * @param name
     * @param obj
     */
    set_pfm(name: string, obj: PERFORM): void {
        if (!this.pfm) {
            this.pfm = {};
        }
        this.pfm[name] = obj;
    }

    // ============ 生命周期 ============

    /**
     * 技能创建回调
     * @param fname
     */
    create(fname: string): void {
        if (WORLD.SKILLS[this.id]) {
            console.log("%s [%s] is repeated ", this.id, fname);
        }
        this.update(fname);
    }

    /**
     * 按品级和基本技能类型存储
     */
    store(): void {
        if (this.type === SKILL_TYPES.KNOWLEDGE
            || this.type === SKILL_TYPES.BASE
        ) return;
        for (let i = 0; i < this.can_enables.length; i++) {
            if (!SKILL[this.can_enables[i]]) SKILL[this.can_enables[i]] = new Array(7);
            if (!SKILL[this.can_enables[i]][this.grade]) SKILL[this.can_enables[i]][this.grade] = [];
            SKILL[this.can_enables[i]][this.grade].push(this);
        }
    }

    /**
     * 技能注册/更新
     * @param fname
     */
    update(fname: string): void {
        WORLD.SKILLS[this.id] = this;
        const fam = this.family || FAMILIES.NONE;
        if (!fam.skills2) fam.skills2 = [];
        if (!fam.skills) fam.skills = [];
        if (!fam.skills3) fam.skills3 = [];
        if (!fam.skills4) fam.skills4 = [];
        let isAddIn = false;
        let ary = this.source_skill ?
            (this.is_ultimate ? fam.skills3 : fam.skills2) :
            (this.is_ultimate ? fam.skills4 : fam.skills);
        if (this.type === SKILL_TYPES.KNOWLEDGE || this.is_hidden) {
            if (!fam.skills0) fam.skills0 = [];
            ary = fam.skills0;
        }
        for (let i = 0; i < ary.length; i++) {
            if (ary[i].id === this.id) {
                ary[i] = this;
                isAddIn = true;
                break;
            }
            if (ary[i].grade > this.grade) {
                ary.splice(i, 0, this);
                isAddIn = true;
                break;
            }
        }
        if (!isAddIn) {
            ary.push(this);
        }
        this.store();

        const desc = level_color[this.grade] || "wht";
        this.color_name = "<" + desc + ">" + this.name + "</" + desc + ">";
        if (this.pfm) {
            for (let key in this.pfm) {
                const raw = this.pfm[key];
                // 将普通对象转换为PERFORM实例(替代原JS的__proto__赋值)
                const pfm = PERFORM.fromPlain(raw);
                if (pfm.enable_skill === 'sword' || pfm.enable_skill === 'blade' || pfm.enable_skill === 'whip'
                    || pfm.enable_skill === 'staff' || pfm.enable_skill === 'club') {
                    pfm.is_weapon = true;
                }
                pfm.id = this.id + "/" + key;
                pfm.pid = key;
                this.pfm[key] = pfm;
            }
        }
    }

    // ============ 静态方法 ============

    /** 引用技能冷却系数 */
    static REF_CD: number = 2;
    /** 特殊槽位定义 */
    static SLOTS: Record<string, any> = {};

    /**
     * 根据ID获取技能
     * @param id
     */
    static get(id: string): SKILL | undefined {
        return WORLD.SKILLS[id];
    }

    // ============ 描述查询 ============

    /**
     * 查询技能完整描述
     * @param me
     * @param lv
     */
    query_desc(me: CHARACTER, lv: number): string {
        const str: string[] = [];
        const grd = this.query_grade(me);
        const cc = level_color[grd] || "wht";
        str.push("<" + cc + ">" + this.name + "</" + cc + ">");
        str.push("\n");
        if (this.family) {
            str.push(this.family.name);
        } else {
            str.push("公共");
        }
        str.push(level_desc[grd] || "");
        str.push("\n");

        str.push(this.desc);
        str.push("\n");
        let prop = this.query_prop(lv, me);
        if (prop) {
            str.push("<");
            str.push(cc);
            str.push(">");
            str.push(UTIL.prop_toString(prop));
            str.push("</");
            str.push(cc);
            str.push(">\n");
        }
        prop = this.query_enable_prop(lv, me);
        let isEnable = this.type === SKILL_TYPES.KNOWLEDGE;
        if (prop) {
            for (let item in prop) {
                const is_enable = me.is_enable_skill(this.id, item);
                if (is_enable) isEnable = true;
                str.push("<");
                str.push(is_enable ? cc : "blk");
                str.push(">当装备为");
                const skItem = SKILL.get(item);
                str.push(skItem ? skItem.name : item);
                str.push("时：\n");
                str.push(UTIL.prop_toString(prop[item]));
                str.push("</");
                str.push(is_enable ? cc : "blk");
                str.push(">\n");
            }
        }
        const sk = me.skills ? me.skills[this.id] : undefined;
        if (sk && sk.addin && sk.addin.length) {
            str.push("\n<");
            str.push(isEnable ? cc : "blk");
            str.push(">");

            const grdTotal = this.grade + sk.addin.length;
            for (let slot of sk.addin) {
                const item = this.query_slot(slot);
                if (item) {
                    str.push("◆");
                    if (item.name) {
                        str.push(item.name);
                        str.push(" ");
                    }
                    str.push((item.format ? item.format(parseInt(item.value(lv, grdTotal))) : item.value(lv, grdTotal)));
                    str.push("\n");
                }
            }
            str.push("</");
            str.push(isEnable ? cc : "blk");
            str.push(">\n");
        }
        if (this.pfm) {
            str.push("<line>绝招</line>\n");
            for (let item in this.pfm) {
                const p_item = this.pfm[item];
                if (!p_item.name) continue;
                this.query_pfm_desc(me, p_item, str, lv);
                str.push("\n\n");
            }
        }
        if (sk && sk.ref) {
            const refs = sk.ref.split("/");
            const sp_skill = SKILL.get(refs[0]);
            if (sp_skill) {
                const pfm = sp_skill.get_pfm(refs[1]);
                if (pfm) {
                    this.query_pfm_desc(me, pfm, str, lv, sp_skill.name);
                    str.push("\n\n");
                }
            }
        }
        return str.join("");
    }

    /**
     * 查询进阶属性槽位
     * @param index - 槽位索引
     */
    query_slot(index: number): any {
        if (index < 500) {
            return SKILL.PROPERTIES ? SKILL.PROPERTIES[index] : undefined;
        } else {
            return this.slots ? this.slots[index - 500] : null;
        }
    }

    /** 通用属性槽位(由外部注册) */
    static PROPERTIES: any[] = [];

    /**
     * 查询绝招描述
     * @param me
     * @param p_item
     * @param str
     * @param lv
     * @param pname - 父技能名(引用技能时)
     */
    query_pfm_desc(me: CHARACTER, p_item: Record<string, any>, str: string[], lv: number, pname?: string): void {
        const canuse = !p_item.check || p_item.check(me, lv) === true;
        let color = canuse ? "hic" : "red";
        if (pname) color = 'hir';
        str.push("<");
        str.push(color);
        str.push(">【");
        if (pname) {
            str.push(pname);
            str.push("•");
        }
        str.push(p_item.name);
        str.push("】");
        if (!canuse) {
            str.push(p_item.use_condition || "");
        }
        str.push("</");
        str.push(color);
        str.push(">");
        if (pname) lv = parseInt(lv / 2);
        str.push("\n内力消耗：");
        str.push(p_item.query_mp(me, lv));
        str.push("\t出招时间：");
        str.push(String(p_item.query_releasetime(me, lv) / 1000));
        str.push("秒\t冷却时间：");
        str.push(String(p_item.query_distime(me, lv, !!pname) / 1000));
        str.push("秒\n");
        str.push(p_item.query_desc ? p_item.query_desc(me, lv) : (p_item.desc || ""));
    }
}

// ============================================================
// PERFORM 绝招类
// ============================================================

export class PERFORM {
    // ============ 核心属性（由资源文件部分设置，update() 补全） ============

    /** 绝招名称 */
    name?: string;
    /** 内力消耗 */
    mp?: number;
    /** 出招时间(毫秒) */
    release_time?: number;
    /** 冷却时间(毫秒) */
    distime?: number;
    /** 出招时间最大值 */
    release_time_max?: number;
    /** 冷却时间最小值 */
    distime_min?: number;
    /** 出招时间最小值 */
    releasetime_min?: number;

    // ============ 消耗减免Key ============

    /** 冷却时间减免key(针对特定属性) */
    distime_key?: string;
    /** 冷却时间百分比减免key */
    distime_per_key?: string;
    /** 出招时间减免key */
    releasetime_key?: string;
    /** 出招时间百分比减免key */
    releasetime_per_key?: string;
    /** 内力消耗百分比减免key */
    expend_mp_per_key?: string;

    // ============ 绝招配置 ============

    /** 所属基本技能类型(如'sword', 'blade') */
    enable_skill?: string;
    /** 使用类型 */
    use_type?: string | number;
    /** 武器类型（资源文件使用） */
    weapon_type?: string;
    /** 使用条件检查函数 */
    check?: (me: CHARACTER, lv: number, base_type?: string) => boolean | string;
    /** 使用条件描述(不满足时显示) */
    use_condition?: string;
    /** 是否禁止自动释放 */
    no_auto?: boolean;
    /** 允许忙碌时使用 */
    allow_busy?: boolean;

    // ============ 绝招ID标识（由 update() 设置） ============

    /** 完整绝招ID (格式: skillId/pfmName) */
    id?: string;
    /** 绝招名(在技能内的key) */
    pid?: string;
    /** 是否为武器绝招 */
    is_weapon?: boolean;
    /** 是否为武器buff绝招 */
    is_weapon_buff?: boolean;
    /** 缓存计数(用于部分绝招逻辑) */
    suc_count?: number;

    // ============ 显示 ============

    /** 攻击消息数组(用于多段攻击) */
    attack_msgs?: string[];

    /** 伤害消息 */
    damage_msg?: string;

    // ============ 回调（由资源文件设置） ============
    /** 使用绝招回调(资源文件使用 — runtime调用pfm.use) */
    use?: (this: PERFORM, me: CHARACTER, target: CHARACTER, lv: number, sktype?: string) => void;
    /** 绝招伤害回调 — 触发时机：绝招每次造成伤害时（do_attack 中伤害计算后） */
    on_attack?: (me: CHARACTER, target: CHARACTER, lv: number, damage: number) => void;
    /** 查询绝招描述回调 — 触发时机：cha 命令查看技能详情时（query_pfm_desc 调用） */
    query_desc?: (me: CHARACTER, lv: number) => string;

    // ============ 冷却/消耗计算（支持热补丁覆盖） ============

    /** 查询绝招名称 */
    query_name(me?: CHARACTER, base_type?: string): string {
        return this.name || "";
    }

    /** 改变绝招冷却时间 */
    change_distime(me: CHARACTER, id: string, add_time?: number): void {
        if (me.is_player) {
            const dis_time = me.temp ? me.temp["pfm/" + id] : undefined;
            if (dis_time) {
                if (add_time)
                    dis_time.e += add_time;
                else {
                    add_time = -(dis_time.time || 0);
                    dis_time.e = 1;
                }
                me.notify('{type:"changepfm",id:"' + id + '",time:' + add_time + '}');
            }
        } else if (me.auto_skills) {
            for (let i = 0; i < me.auto_skills.length; i++) {
                const item = me.auto_skills[i];
                if (item.pfm === this) {
                    if (add_time)
                        item.release_time += add_time;
                    else
                        item.release_time = 0;
                }
            }
        }
    }

    /** 查询出招时间 */
    query_releasetime(me: CHARACTER, lv: number): number {
        var rtime = this.release_time ?? 0;
        if (!(rtime >= 0)) rtime = me.gjsd;

        if (this.releasetime_key) {
            rtime = rtime - me.query_prop("releasetime") - me.query_prop(this.releasetime_key);
        } else {
            rtime = rtime - me.query_prop("releasetime");
        }

        if (this.releasetime_per_key) {
            rtime = rtime - rtime * (me.query_prop("releasetime_per") + me.query_prop(this.releasetime_per_key)) / 100;
        } else {
            rtime = rtime - rtime * (me.query_prop("releasetime_per")) / 100;
        }
        if (rtime < 500) return 500;
        return Math.floor(rtime);
    }

    /** 查询冷却时间 */
    query_distime(me: CHARACTER, lv?: number, isref?: boolean): number {
        var dis = this.distime ?? 0;
        if (!dis) dis = me.gjsd;
        if (isref) dis = dis * 2;
        if (this.distime_key) {
            dis = dis - me.query_prop("distime") - me.query_prop(this.distime_key);
        } else {
            dis = dis - me.query_prop("distime");
        }
        if (this.distime_per_key) {
            dis = dis - dis * (me.query_prop("distime_per") + me.query_prop(this.distime_per_key)) / 100;
        } else {
            dis = dis - dis * (me.query_prop("distime_per")) / 100;
        }

        if (dis < 3000) return 3000;
        return Math.floor(dis);
    }

    /** 查询内力消耗 */
    query_mp(me: CHARACTER, lv: number): number {
        var mp = this.mp || 0;

        mp = mp + lv * mp / 20;
        if (this.expend_mp_per_key) {
            mp = mp - mp * (me.query_prop("expend_mp_per")
                + me.query_prop(this.expend_mp_per_key)) / 100;
        } else {
            mp = mp - mp * me.query_prop("expend_mp_per") / 100;
        }
        if (mp < 0) mp = 0;
        return Math.floor(mp);
    }

    /**
     * 从普通对象创建PERFORM实例
     * 替代原JS中 pfm.__proto__ = PERFORM.prototype 的模式
     * @param obj - 资源文件中的绝招定义对象
     */
    static fromPlain(obj: Partial<PERFORM>): PERFORM {
        const pfm = new PERFORM();
        // 复制所有可枚举属性(包含函数)
        for (const key of Object.keys(obj)) {
            pfm[key] = obj[key];
        }
        return pfm;
    }

}
