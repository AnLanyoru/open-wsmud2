/**
 * SKILL 技能基类 & PERFORM 绝招类
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";
import { UTIL } from "../util.js";
import { FAMILIES } from "./family.js";

// 从 os/const.js 导入常量
// 注意: 这些常量应被迁移到 server/core/const.ts
const SKILL_TYPES = { BASE: 0, SKILL: 1, KNOWLEDGE: 2 } as const;
const PROPERTIES: Record<string, string> = {};

// 懒加载 CHARACTER 避免循环依赖
let _CHARACTER: any = null;
import("../char/character.js").then((m: any) => { _CHARACTER = m.CHARACTER; });

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
    learn_condition: Record<string, any> = {};

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
    /** 技能移除回调 */
    on_remove?: (me: any, skill: any) => boolean | void;

    // ============ 绝招与技能槽 ============

    /** 绝招字典(由资源文件设置) */
    pfm: Record<string, any> | null = null;
    /** 进阶属性槽位(由资源文件设置) */
    slots: any[] | null = null;

    // ============ 配置属性(由资源文件设置) ============

    /** 可装备的基本技能类型列表 */
    can_enables: string[] = [];
    /** 所属门派 */
    family?: any;
    /** 源技能(进阶来源) */
    source_skill?: string;
    /** 是否为终极技能 */
    is_ultimate?: boolean;
    /** 是否隐藏 */
    is_hidden?: boolean;
    /** 技能颜色名称缓存 */
    color_name: string = "";
    /** 学习条件字符串缓存 */
    learn_condition_string?: string;

    // ============ 回调(由资源文件设置) ============

    /** 启用技能回调 */
    on_enable?: (me: any, type: string) => boolean | void;
    /** 禁用技能回调 */
    on_disenable?: (me: any, type: string) => void;
    /** 学习技能回调 */
    on_learn?: (me: any) => boolean | void;
    /** 查询启用属性 */
    query_enable_prop?: (lv: number, me?: any) => Record<string, any> | undefined;
    /** 查询基础属性 */
    query_prop?: (lv: number, me?: any) => Record<string, any> | undefined;
    /** 敌人死亡回调 */
    on_enemy_die?: (me: any, target: any) => void;

    constructor() {
        super();
    }

    // ============ 动作查询 ============

    /**
     * 获取攻击动作描述
     * @param me - 攻击者
     * @param target - 目标
     */
    query_attack_action(me: any, target: any): string {
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
    query_parry_action(me: any, target: any, w2?: any): string {
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
    level_exp(lv: number, me?: any): number {
        const grd = this.query_grade(me);
        return (lv + 1) * (grd + 1) * 5;
    }

    /**
     * 查询从100级到指定等级总需经验
     * @param level
     * @param me
     */
    query_needexp(level: number, me?: any): number {
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
    release_prop(me: any, lv: number): void {
        if (!lv) return;
        let prop = this.query_prop ? this.query_prop(lv, me) : undefined;
        if (prop) {
            me.change_prop(prop, false);
        }
        prop = this.query_enable_prop ? this.query_enable_prop(lv, me) : undefined;
        if (prop) {
            for (let item in prop) {
                if (me.is_enable_skill(this.id, item)) {
                    me.change_prop(prop[item], false);
                }
            }
        }
        prop = this.query_addin_prop(me, lv);
        if (prop) {
            if (this.is_enable(me)) {
                me.change_prop(prop, false);
            }
        }
    }

    /**
     * 附加技能属性
     * @param me
     * @param lv
     */
    attach_prop(me: any, lv: number): void {
        if (!lv) return;
        let prop = this.query_prop ? this.query_prop(lv, me) : undefined;
        if (prop) {
            me.change_prop(prop, true);
        }
        prop = this.query_enable_prop ? this.query_enable_prop(lv, me) : undefined;
        if (prop) {
            for (let item in prop) {
                if (me.is_enable_skill(this.id, item)) {
                    me.change_prop(prop[item], true);
                }
            }
        }
        prop = this.query_addin_prop(me, lv);
        if (prop) {
            if (this.is_enable(me)) {
                me.change_prop(prop, true);
            }
        }
    }

    // ============ 品级与颜色 ============

    /**
     * 查询技能品级(含进阶)
     * @param me
     */
    query_grade(me?: any): number {
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
    query_color_name(me?: any): string {
        const desc = level_color[this.query_grade(me)] || "wht";
        return "<" + desc + ">" + this.name + "</" + desc + ">";
    }

    // ============ 进阶属性 ============

    /**
     * 查询进阶属性
     * @param me
     * @param lv
     */
    query_addin_prop(me: any, lv: number): Record<string, number> | undefined {
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
    is_enable(me: any): boolean {
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
    is_enable2(me: any, baseskill: string): boolean {
        const skill = me.skills ? me.skills[this.id] : undefined;
        return skill ? skill[baseskill] : false;
    }

    /**
     * 激活技能
     * @param me
     * @param type - 基本技能类型
     */
    enable(me: any, type: string): boolean {
        if (!this.can_enables || !this.can_enables.contain(type)) return false;
        if (this.on_enable && this.on_enable(me, type) === false) return false;
        const lv = me.query_skill(this.id);
        let prop = this.query_enable_prop ? this.query_enable_prop(lv, me) : undefined;
        if (prop) {
            const enable_prop = prop[type];
            if (enable_prop) {
                me.change_prop(enable_prop, true);
            }
        }
        prop = this.query_addin_prop(me, lv);
        if (prop) {
            if (!this.is_enable(me)) {
                me.change_prop(prop, true);
            }
        }
        return true;
    }

    /**
     * 取消激活技能
     * @param me
     * @param type
     */
    disenable(me: any, type: string): boolean {
        this.on_disenable && this.on_disenable(me, type);
        const lv = me.query_skill(this.id);
        let prop = this.query_enable_prop ? this.query_enable_prop(lv, me) : undefined;
        if (prop) {
            const enable_prop = prop[type];
            if (enable_prop) {
                me.change_prop(enable_prop, false);
            }
        }

        prop = this.query_addin_prop(me, lv);
        if (prop) {
            if (!this.is_enable(me)) {
                me.change_prop(prop, false);
            }
        }
        return true;
    }

    // ============ 学习条件 ============

    /**
     * 检查并执行学习条件
     * @param me
     */
    do_learn(me: any): boolean | undefined {
        if (this.on_learn && this.on_learn(me) === false) return false;
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
    item_to_json(str: string[], skill_item: any, me: any): void {
        str.push('{"id":"');
        str.push(this.id);

        str.push('","name":"');
        str.push(this.query_color_name(me));
        str.push('",grade:', this.query_grade(me));
        str.push(',"level":');
        str.push(me.query_skill(this.id));
        str.push(',"exp":');
        skill_item.exp = skill_item.exp || 0;
        str.push(parseInt(skill_item.exp * 100 / this.level_exp(skill_item.level, me)) as any);
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
    add_exp(me: any, exp: number): boolean | undefined {
        let skill = me.skills ? me.skills[this.id] : undefined;
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
            me.notify('{type:"dialog",dialog:"skills",id:"' + this.id + '",level:' + lv + ',exp:' + parseInt(skill.exp * 100 / need_exp) + '}');
            me.recount();
            me.add_score(sum_score);
            return true;
        } else {
            me.notify('{type:"dialog",dialog:"skills",id:"' + this.id + '",exp:' + parseInt(skill.exp * 100 / need_exp) + '}');
        }
    }

    // ============ 积分 ============

    /**
     * 查询技能总积分
     * @param lv
     * @param me
     */
    query_score(lv: number, me?: any): number {
        if (lv <= 100) return 0;
        return (lv - 100) * this.query_one_score(me);
    }

    /**
     * 查询每级积分
     * @param me
     */
    query_one_score(me?: any): number {
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
    grade_up(me: any, target_skill: SKILL): boolean {
        const skill = me.skills ? me.skills[this.id] : undefined;
        if (!skill || !(skill.level >= 1000)) return false;

        if (me.remove_skill(this.id) === false) return false;
        me.notify('{type:"dialog",dialog:"skills",remove:"' + this.id + '"}');
        const pot = this.query_needexp(skill.level, me);
        const lv = pot * 2 / 5 / (target_skill.grade + 1);
        const newSkill: any = {
            level: parseInt(Math.pow(lv, 0.5) as any),
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
    get_pfm(name: string): any | undefined {
        if (this.pfm) {
            return this.pfm[name];
        }
    }

    /**
     * 设置绝招
     * @param name
     * @param obj
     */
    set_pfm(name: string, obj: any): void {
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
            if (!(SKILL as any)[this.can_enables[i]]) (SKILL as any)[this.can_enables[i]] = new Array(7);
            if (!(SKILL as any)[this.can_enables[i]][this.grade]) (SKILL as any)[this.can_enables[i]][this.grade] = [];
            (SKILL as any)[this.can_enables[i]][this.grade].push(this);
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
    query_desc(me: any, lv: number): string {
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
        let prop = this.query_prop ? this.query_prop(lv, me) : undefined;
        if (prop) {
            str.push("<");
            str.push(cc);
            str.push(">");
            str.push(UTIL.prop_toString(prop));
            str.push("</");
            str.push(cc);
            str.push(">\n");
        }
        prop = this.query_enable_prop ? this.query_enable_prop(lv, me) : undefined;
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
            return SKILL.PROPERTIES ? (SKILL as any).PROPERTIES[index] : undefined;
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
    query_pfm_desc(me: any, p_item: any, str: string[], lv: number, pname?: string): void {
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
        if (pname) lv = parseInt(lv / 2 as any);
        str.push("\n内力消耗：");
        str.push(p_item.query_mp(me, lv));
        str.push("\t出招时间：");
        str.push(p_item.query_releasetime(me, lv) / 1000);
        str.push("秒\t冷却时间：");
        str.push(p_item.query_distime(me, lv, !!pname) / 1000);
        str.push("秒\n");
        str.push(p_item.query_desc ? p_item.query_desc(me, lv) : (p_item.desc || ""));
    }
}

// ============================================================
// PERFORM 绝招类
// ============================================================

export class PERFORM extends BASE {

    // ============ 核心属性 ============

    /** 绝招名称 */
    name: string = "";
    /** 内力消耗 */
    mp: number = 0;
    /** 出招时间(毫秒) */
    release_time: number = 0;
    /** 冷却时间(毫秒) */
    distime: number = 0;
    /** 出招时间最大值 */
    release_time_max: number = 0;
    /** 冷却时间最小值 */
    distime_min: number = 0;
    /** 出招时间最小值 */
    releasetime_min: number = 0;

    // ============ 消耗减免Key ============

    /** 冷却时间减免key(针对特定属性) */
    distime_key: string = "";
    /** 冷却时间百分比减免key */
    distime_per_key: string = "";
    /** 出招时间减免key */
    releasetime_key: string = "";
    /** 出招时间百分比减免key */
    releasetime_per_key: string = "";
    /** 内力消耗百分比减免key */
    expend_mp_per_key: string = "";

    // ============ 绝招配置 ============

    /** 所属基本技能类型(如'sword', 'blade') */
    enable_skill: string = "";
    /** 使用类型 */
    use_type: string = "";
    /** 使用条件检查函数 */
    check?: (me: any, lv: number) => boolean | string;
    /** 使用条件描述(不满足时显示) */
    use_condition: string = "";
    /** 是否禁止自动释放 */
    no_auto: boolean = false;
    /** 允许忙碌时使用 */
    allow_busy: boolean = false;

    // ============ 绝招ID标识 ============

    /** 完整绝招ID (格式: skillId/pfmName) */
    id: string = "";
    /** 绝招名(在技能内的key) */
    pid: string = "";
    /** 是否为武器绝招 */
    is_weapon: boolean = false;

    // ============ 显示 ============

    /** 伤害消息 */
    damage_msg: string = "";

    // ============ 回调(由资源文件设置) ============

    /** 使用绝招回调 */
    on_use?: (me: any, target: any, lv: number) => void;
    /** 攻击触发回调 */
    on_attack?: (me: any, target: any, lv: number, damage: number) => void;
    /** 查询描述 */
    query_desc?: (me: any, lv: number) => string;

    constructor() {
        super();
    }

    /**
     * 从普通对象创建PERFORM实例
     * 替代原JS中 pfm.__proto__ = PERFORM.prototype 的模式
     * @param obj - 资源文件中的绝招定义对象
     */
    static fromPlain(obj: Record<string, any>): PERFORM {
        const pfm = new PERFORM();
        // 复制所有可枚举属性(包含函数)
        for (const key of Object.keys(obj)) {
            (pfm as any)[key] = obj[key];
        }
        return pfm;
    }

    /**
     * 查询绝招名称
     * @param me
     */
    query_name(me?: any): string {
        return this.name;
    }

    // ============ 冷却管理 ============

    /**
     * 改变绝招冷却时间
     * @param me
     * @param id - 绝招ID
     * @param add_time - 增加冷却时间(毫秒), 不传则清除
     */
    change_distime(me: any, id: string, add_time?: number): void {
        if (me.is_player) {
            const dis_time = me.temp ? me.temp["pfm/" + id] : undefined;
            if (dis_time) {
                if (add_time)
                    dis_time.e += add_time;
                else {
                    add_time = -dis_time.time;
                    dis_time.e = 1;
                }
                me.notify('{type:"changepfm",id:"' + id + '",time:' + add_time + '}');
            }
        } else if (me.auto_skills) {
            for (let i = 0; i < me.auto_skills.length; i++) {
                const item = me.auto_skills[i];
                if ((item as any).pfm === this) {
                    if (add_time)
                        (item as any).release_time += add_time;
                    else
                        (item as any).release_time = 0;
                }
            }
        }
    }

    // ============ 属性计算 ============

    /**
     * 查询出招时间
     * @param me
     * @param lv
     */
    query_releasetime(me: any, lv: number): number {
        var rtime = this.release_time;
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
        return parseInt(rtime);
    }

    /**
     * 查询冷却时间
     * @param me
     * @param lv
     * @param isref - 是否为引用技能
     */
    query_distime(me: any, lv: number, isref?: boolean): number {
        var dis = this.distime;
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
        return parseInt(dis);
    }

    /**
     * 查询内力消耗
     * @param me
     * @param lv
     */
    query_mp(me: any, lv: number): number {
        var mp = this.mp || 0;

        mp = mp + lv * mp / 20;
        if (this.expend_mp_per_key) {
            mp = mp - mp * (me.query_prop("expend_mp_per")
                + me.query_prop(this.expend_mp_per_key)) / 100;
        } else {
            mp = mp - mp * me.query_prop("expend_mp_per") / 100;
        }
        if (mp < 0) mp = 0;
        return parseInt(mp);
    }
}
