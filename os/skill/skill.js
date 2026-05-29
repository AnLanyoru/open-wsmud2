/**
 * SKILL 技能基类 & PERFORM 绝招类
 */
import { BASE } from "../base.js";
import { WORLD } from "../world.js";
import { UTIL } from "../util/util.js";
import { CHARACTER } from "../char/character.js";
import { FAMILIES } from "./family.js";
import { SKILL_TYPES, PROPERTIES } from "../const.js";

export class SKILL extends BASE {

    // ============ 核心属性 ============

    /** @type {string} 技能ID */
    id = "";
    /** @type {string} 技能名称 */
    name = "";
    /** @type {number} SKILL_TYPES枚举值 */
    type = SKILL_TYPES.SKILL;
    /** @type {number} 技能品级 */
    grade = 1;
    /** @type {number} 技能评分 */
    score = 0;

    constructor() {
        super();
    }

    /**
     * 获取攻击动作描述
     * @param {CHARACTER} me - 攻击者
     * @param {CHARACTER} target - 目标
     * @returns {string}
     */
    query_attack_action(me, target) {
        if (this.attack_actions)
            return this.attack_actions.random();
        return "";
    }

    /**
     * 获取闪避动作描述
     * @returns {string}
     */
    query_dodge_action() {
        if (!this.dodge_actions) {
            return "";
        }
        return this.dodge_actions.random();
    }

    /**
     * 获取招架动作描述
     * @param {CHARACTER} me - 防御者
     * @param {CHARACTER} target - 攻击者
     * @param {EQUIPMENT} [w2] - 攻击者武器
     * @returns {string}
     */
    query_parry_action(me, target, w2) {
        const w1 = me.query_weapon();
        w2 = w2 || target.query_weapon();
        let act;
        if (w1 && w2) {
            act = this.weapon_vs_weapon_actions || this.parry_actions;
        } else if (w1) {
            act = this.weapon_vs_unarmed_actions || this.parry_actions;
        } else if (w2) {
            act = this.unarmed_vs_weapon_actions || this.parry_actions;
        } else {
            act = this.parry_actions;
        }

        if (!act) {
            act = this.parry_actions = SKILL.get("parry").parry_actions;
        }

        if (act) {
            return act.random();
        }
    }

    /**
     * 查升级所需经验
     * @param {number} lv - 当前等级
     * @param {CHARACTER} me
     * @returns {number}
     */
    level_exp(lv, me) {
        const grd = this.query_grade(me);
        return (lv + 1) * (grd + 1) * 5;
    }

    /**
     * 查询从100级到指定等级总需经验
     * @param {number} level
     * @param {CHARACTER} me
     * @returns {number}
     */
    query_needexp(level, me) {
        if (level > 100) {
            const grd = this.query_grade(me);
            const exp = (100 + level) * (level - 100) / 2;
            return exp * (grd + 1) * 5;
        } else {
            return 0;
        }
    }


    /**
     * 设置为默认技能
     * @param {string} type - 基本技能类型
     * @returns {void}
     */
    set_default(type) {
        WORLD.DEFAULT_SKILLS[type] = this;
    }

    /**
     * 移除技能附加属性
     * @param {CHARACTER} me
     * @param {number} lv - 技能等级
     * @returns {void}
     */
    release_prop(me, lv) {
        if (!lv) return;
        let prop = this.query_prop(lv, me);
        if (prop) {
            me.change_prop(prop, false);
        }
        prop = this.query_enable_prop(lv, me);
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
     * @param {CHARACTER} me
     * @param {number} lv
     * @returns {void}
     */
    attach_prop(me, lv) {
        if (!lv) return;
        let prop = this.query_prop(lv, me);
        if (prop) {
            me.change_prop(prop, true);
        }
        prop = this.query_enable_prop(lv, me);
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

    /**
     * 查询装备属性(子类重写)
     * @param {number} lv
     * @returns {Object<string, Object>|undefined}
     */
    query_enable_prop(lv) {

    }

    /**
     * 查询基础属性(子类重写)
     * @param {number} lv
     * @returns {Object<string, number>|undefined}
     */
    query_prop(lv) {

    }

    /**
     * 查询技能品级(含进阶)
     * @param {CHARACTER} me
     * @returns {number}
     */
    query_grade(me) {
        const sk = me.skills[this.id];
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
     * @param {CHARACTER} me
     * @returns {string}
     */
    query_color_name(me) {

        const desc = level_color[this.query_grade(me)];
        return "<" + desc + ">" + this.name + "</" + desc + ">";
    }

    /**
     * 查询进阶属性
     * @param {CHARACTER} me
     * @param {number} lv
     * @returns {Object<string, number>|null}
     */
    query_addin_prop(me, lv) {
        const sk = me.skills[this.id];
        if (sk.addin && sk.addin.length) {
            const prop = {};
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
        return null;
    }

    /**
     * 检查技能是否已装备到某个基本技能
     * @param {CHARACTER} me
     * @returns {boolean}
     */
    is_enable(me) {
        if (this.type !== SKILL_TYPES.SKILL) return true;
        const skill = me.skills[this.id];
        for (let i = 0; i < this.can_enables.length; i++) {
            if (skill[this.can_enables[i]]) return true;
        }
        return false;
    }

    /**
     * 检查技能是否装备到指定基本技能
     * @param {CHARACTER} me
     * @param {string} baseskill
     * @returns {boolean}
     */
    is_enable2(me, baseskill) {
        const skill = me.skills[this.id];

        return skill ? skill[baseskill] : false;
    }

    /**
     * 激活技能
     * @param {CHARACTER} me
     * @param {string} type - 基本技能类型
     * @returns {boolean}
     */
    enable(me, type) {
        if (!this.can_enables || !this.can_enables.contain(type)) return false;
        if (this.on_enable && this.on_enable(me, type) === false) return false;
        const lv = me.query_skill(this.id);
        let prop = this.query_enable_prop(lv);
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
     * @param {CHARACTER} me
     * @param {string} type
     * @returns {boolean}
     */
    disenable(me, type) {
        this.on_disenable && this.on_disenable(me, type);
        const lv = me.query_skill(this.id);
        let prop = this.query_enable_prop(lv);
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

    /**
     * 检查并执行学习条件
     * @param {CHARACTER} me
     * @returns {boolean|undefined}
     */
    do_learn(me) {
        if (this.on_learn && this.on_learn(me) === false) return false;
        if (this.learn_condition) {
            for (let key in this.learn_condition) {
                const val = this.learn_condition[key];
                switch (key) {
                    case "skill":
                        for (let sk in val) {
                            if (me.query_skill(sk, 0) < val[sk] && me.query_skill(sk + "2", 0) < val[sk]) {
                                const sk_base = SKILL.get(sk);

                                return me.notify_fail("你的" + sk_base.color_name + "等级不够" + val[sk] + "，无法学习" + this.color_name + "。");
                            }
                        }
                        break;
                    case "str1":
                    case "con1":
                    case "dex1":
                    case "int1":
                        if (me.is_player && me[key.replace("1", "")] < val) {
                            return me.notify_fail("你的" + PROPERTIES[key] + "不够" + val + "，无法学习" + this.color_name + "。");
                        }
                        break;
                    case "str":
                    case "con":
                    case "dex":
                    case "int":
                        if (me[key] + me.query_prop(key) < val) {
                            return me.notify_fail("你的" + PROPERTIES[key] + "不够" + val + "，无法学习" + this.color_name + "。");
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

                            return me.notify_fail("你的" + PROPERTIES[key] + "不够" + val + "，无法学习" + this.color_name + "。");
                        }
                        break;
                }
            }
        } else {
            if (this.type === SKILL_TYPES.SKILL && this.can_enables) {
                for (let i = 0; i < this.can_enables.length; i++) {
                    if (!me.query_skill(this.can_enables[i], 0)) {
                        const skill = SKILL.get(this.can_enables[i]);
                        return me.notify_fail("你还不会" + skill.color_name + "，无法学习" + this.color_name + "。");
                    }
                }
            }
        }
        return true;
    }

    /**
     * 学习条件转字符串
     * @param {CHARACTER} me
     * @returns {string}
     */
    condition_tostring(me) {
        if (this.learn_condition_string) return this.learn_condition_string;
        const str = [];
        if (this.learn_condition) {
            for (let key in this.learn_condition) {
                const val = this.learn_condition[key];
                switch (key) {
                    case "skill":
                        for (let sk in val) {
                            const sk_base = SKILL.get(sk);
                            str.push(sk_base.name + "：" + val[sk] + "级");
                        }
                        break;
                    case "desc":
                        str.push(val);
                        break;
                    case "gender":
                        str.push("性别：" + (val === 1 ? "男" : (val === 2 ? "女" : "无性")));
                        break;
                    default:
                        str.push(PROPERTIES[key] + "：" + val);
                        break;
                }
            }
        }
        this.learn_condition_string = str.join("\n");
        return this.learn_condition_string;
    }

    /**
     * 技能JSON序列化
     * @param {string[]} str - 输出数组
     * @param {*} skill_item - 技能数据
     * @param {CHARACTER} me
     * @returns {void}
     */
    item_to_json(str, skill_item, me) {
        str.push('{"id":"');
        str.push(this.id);

        str.push('","name":"');
        str.push(this.query_color_name(me));
        str.push('",grade:', this.query_grade(me));
        str.push(',"level":');
        str.push(me.query_skill(this.id));
        str.push(',"exp":');
        skill_item.exp = skill_item.exp || 0;
        str.push(parseInt(skill_item.exp * 100 / this.level_exp(skill_item.level, me)));
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

    /**
     * 增加技能经验
     * @param {CHARACTER} me
     * @param {number} exp
     * @returns {boolean|undefined} true表示升级了
     */
    add_exp(me, exp) {
        let skill = me.skills[this.id];
        if (!skill) {
            skill = {
                level: 0,
                exp: 0
            };
            const str = ['{type:"dialog",dialog:"skills",item:'];
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

    /**
     * 查询技能总积分
     * @param {number} lv
     * @param {CHARACTER} me
     * @returns {number}
     */
    query_score(lv, me) {
        if (lv <= 100) return 0;
        return (lv - 100) * this.query_one_score(me);
    }

    /**
     * 查询每级积分
     * @param {CHARACTER} me
     * @returns {number}
     */
    query_one_score(me) {
        let sc = 0;
        if (this.type === SKILL_TYPES.SKILL) {
            sc = this.query_grade(me);
        } else if (this.type === SKILL_TYPES.BASE) {
            sc = 1;
        }
        return sc;
    }

    /**
     * 技能进阶
     * @param {CHARACTER} me
     * @param {SKILL} target_skill - 目标技能
     * @returns {boolean}
     */
    grade_up(me, target_skill) {
        const skill = me.skills[this.id];
        if (!skill || !(skill.level >= 1000)) return false;

        if (me.remove_skill(this.id) === false) return false;
        me.notify('{type:"dialog",dialog:"skills",remove:"' + this.id + '"}');
        const pot = this.query_needexp(skill.level, me);
        const lv = pot * 2 / 5 / (target_skill.grade + 1);
        skill.level = parseInt(Math.pow(lv, 0.5));
        skill.exp = 0;
        me.skills[target_skill.id] = skill;
        const str = ['{type:"dialog",dialog:"skills",item:'];
        target_skill.item_to_json(str, skill, me);
        str.push("}");
        me.notify(str.join(""));
        me.add_score(target_skill.query_score(skill.level, me));
        target_skill.attach_prop(me, skill.level);
        me.recount();
        return true;
    }

    /**
     * 获取绝招定义
     * @param {string} name - 绝招名
     * @returns {PERFORM|undefined}
     */
    get_pfm(name) {
        if (this.pfm) {
            return this.pfm[name];
        }
    }

    /**
     * 设置绝招
     * @param {string} name
     * @param {PERFORM} obj
     * @returns {void}
     */
    set_pfm(name, obj) {
        if (!this.pfm) {
            this.pfm = {};
        }
        this.pfm[name] = obj;
    }

    /**
     * 技能创建回调
     * @param {string} fname
     * @returns {void}
     */
    create(fname) {
        if (WORLD.SKILLS[this.id]) {
            console.log("%s [%s] is repeated ", this.id, fname);
        }
        this.update(fname);
    }

    /**
     * 按品级和基本技能类型存储
     * @returns {void}
     */
    store() {
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
     * @param {string} fname
     * @returns {void}
     */
    update(fname) {
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

        const desc = level_color[this.grade];
        this.color_name = "<" + desc + ">" + this.name + "</" + desc + ">";
        if (this.pfm) {
            for (let key in this.pfm) {
                const pfm = this.pfm[key];
                if (pfm.enable_skill === 'sword' || pfm.enable_skill === 'blade' || pfm.enable_skill === 'whip'
                    || pfm.enable_skill === 'staff' || pfm.enable_skill === 'club') {
                    pfm.is_weapon = true;
                }
                pfm.id = this.id + "/" + key;
                pfm.pid = key;
                pfm.__proto__ = PERFORM.prototype;
            }
        }
    }

    /**
     * 根据ID获取技能
     * @param {string} id
     * @returns {SKILL|undefined}
     */
    static get(id) {
        return WORLD.SKILLS[id];
    }

    /**
     * 查询技能完整描述
     * @param {CHARACTER} me
     * @param {number} lv
     * @returns {string}
     */
    query_desc(me, lv) {
        const str = [];
        const grd = this.query_grade(me);
        const cc = level_color[grd];
        str.push("<" + cc + ">" + this.name + "</" + cc + ">");
        str.push("\n");
        if (this.family) {
            str.push(this.family.name);
        } else {
            str.push("公共");
        }
        str.push(level_desc[grd]);
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
                str.push(SKILL.get(item).name);
                str.push("时：\n");
                str.push(UTIL.prop_toString(prop[item]));
                str.push("</");
                str.push(is_enable ? cc : "blk");
                str.push(">\n");
            }
        }
        const sk = me.skills[this.id];
        if (sk && sk.addin && sk.addin.length) {
            str.push("\n<");
            str.push(isEnable ? cc : "blk");
            str.push(">");

            const grd = this.grade + sk.addin.length;
            for (let slot of sk.addin) {
                const item = this.query_slot(slot);
                if (item) {
                    str.push("◆");
                    if (item.name) {
                        str.push(item.name);
                        str.push(" ");
                    }
                    str.push(item.format(parseInt(item.value(lv, grd))));
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
     * @param {number} index - 槽位索引
     * @returns {*}
     */
    query_slot(index) {
        if (index < 500) {
            return SKILL.PROPERTIES[index];
        } else {
            return this.slots ? this.slots[index - 500] : null;
        }
    }

    /** @type {number} 引用技能冷却系数 */
    static REF_CD = 2;
    /** @type {Object<string, *>} 特殊槽位定义 */
    static SLOTS = {};

    /**
     * 查询绝招描述
     * @param {CHARACTER} me
     * @param {PERFORM} p_item
     * @param {string[]} str
     * @param {number} lv
     * @param {string} [pname] - 父技能名(引用技能时)
     * @returns {void}
     */
    query_pfm_desc(me, p_item, str, lv, pname) {
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
        str.push(p_item.query_releasetime(me, lv) / 1000);
        str.push("秒\t冷却时间：");
        str.push(p_item.query_distime(me, lv, pname) / 1000);
        str.push("秒\n");
        str.push(p_item.query_desc(me, lv));
    }
}

export class PERFORM extends BASE {

    /** @type {string} 绝招名称 */
    name = "";

    constructor() {
        super();
    }

    /**
     * 查询绝招名称
     * @param {CHARACTER} me
     * @returns {string}
     */
    query_name(me) {
        return this.name;
    }

    /**
     * 改变绝招冷却时间
     * @param {CHARACTER} me
     * @param {string} id - 绝招ID
     * @param {number} [add_time] - 增加冷却时间(毫秒), 不传则清除
     * @returns {void}
     */
    change_distime(me, id, add_time) {
        if (me.is_player) {
            const dis_time = me.temp["pfm/" + id];
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
                if (item.pfm === this) {
                    if (add_time)
                        item.release_time += add_time;
                    else
                        item.release_time = 0;
                }
            }
        }

    }
}

/** @type {string[]} 品级颜色 */
const level_color = ["wht", "hig", "hic", "hiy", "hiz", "hio", "ord"];
/** @type {string[]} 品级描述 */
const level_desc = ["基本技能", "普通技能", "高级技能", "稀有武技", "绝世武功", "绝世神功", "无上神武"];
