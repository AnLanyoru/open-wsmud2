/**
 * SKILL 技能基类 & PERFORM 绝招类
 */
/*global SKILL_TYPES SKILL BASE PROPERTIES WORLD FAMILIES*/

require("../util/util.js");

/** @type {function} */
SKILL = function () {
    this.id = "";
    this.name = "";
    /** @type {number} 技能类型 */
    this.type = SKILL_TYPES.SKILL;
    /** @type {number} 品级 */
    this.grade = 1;
    this.score = 0;
}
SKILL.inherits(BASE);

/**
 * 获取攻击动作描述
 * @param {CHARACTER} me - 攻击者
 * @param {CHARACTER} target - 目标
 * @returns {string}
 */
SKILL.prototype.query_attack_action = function (me, target) {
    if (this.attack_actions)
        return this.attack_actions.random();
    return "";
}

/**
 * 获取闪避动作描述
 * @returns {string}
 */
SKILL.prototype.query_dodge_action = function () {
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
SKILL.prototype.query_parry_action = function (me, target, w2) {
    var w1 = me.query_weapon();
    w2 = w2 || target.query_weapon();
    var act;
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
SKILL.prototype.level_exp = function (lv, me) {
    var grd = this.query_grade(me);
    return (lv + 1) * (grd + 1) * 5;
}

/**
 * 查询从100级到指定等级总需经验
 * @param {number} level
 * @param {CHARACTER} me
 * @returns {number}
 */
SKILL.prototype.query_needexp = function (level, me) {
    if (level > 100) {
        var grd = this.query_grade(me);
        var exp = (100 + level) * (level - 100) / 2;
        return exp * (grd + 1) * 5;
    } else {
        return 0;
    }
}


/**
 * 设置为默认技能
 * @param {string} type - 基本技能类型
 */
SKILL.prototype.set_default = function (type) {
    WORLD.DEFAULT_SKILLS[type] = this;
}

/**
 * 移除技能附加属性
 * @param {CHARACTER} me
 * @param {number} lv - 技能等级
 */
SKILL.prototype.release_prop = function (me, lv) {
    if (!lv) return;
    var prop = this.query_prop(lv, me);
    if (prop) {
        me.change_prop(prop, false);
    }
    prop = this.query_enable_prop(lv, me);
    if (prop) {
        for (var item in prop) {
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
 */
SKILL.prototype.attach_prop = function (me, lv) {
    if (!lv) return;
    var prop = this.query_prop(lv, me);
    if (prop) {
        me.change_prop(prop, true);
    }
    prop = this.query_enable_prop(lv, me);
    if (prop) {
        for (var item in prop) {
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
SKILL.prototype.query_enable_prop = function (lv) {

}

/**
 * 查询基础属性(子类重写)
 * @param {number} lv
 * @returns {Object<string, number>|undefined}
 */
SKILL.prototype.query_prop = function (lv) {

}

/**
 * 查询技能品级(含进阶)
 * @param {CHARACTER} me
 * @returns {number}
 */
SKILL.prototype.query_grade = function (me) {
    var sk = me.skills[this.id];
    var lv = this.grade;
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
SKILL.prototype.query_color_name = function (me) {

    var desc = level_color[this.query_grade(me)];
    return "<" + desc + ">" + this.name + "</" + desc + ">";
}

/**
 * 查询进阶属性
 * @param {CHARACTER} me
 * @param {number} lv
 * @returns {Object<string, number>|null}
 */
SKILL.prototype.query_addin_prop = function (me, lv) {
    var sk = me.skills[this.id];
    if (sk.addin && sk.addin.length) {
        var prop = {};
        var grd = this.grade + sk.addin.length;
        for (let slot of sk.addin) {
            let item = this.query_slot(slot);
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
SKILL.prototype.is_enable = function (me) {
    if (this.type !== SKILL_TYPES.SKILL) return true;
    var skill = me.skills[this.id];
    for (var i = 0; i < this.can_enables.length; i++) {
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
SKILL.prototype.is_enable2 = function (me, baseskill) {
    var skill = me.skills[this.id];

    return skill ? skill[baseskill] : false;
}

/**
 * 激活技能
 * @param {CHARACTER} me
 * @param {string} type - 基本技能类型
 * @returns {boolean}
 */
SKILL.prototype.enable = function (me, type) {
    if (!this.can_enables || !this.can_enables.contain(type)) return false;
    if (this.on_enable && this.on_enable(me, type) === false) return false;
    var lv = me.query_skill(this.id);
    var prop = this.query_enable_prop(lv);
    if (prop) {
        var enable_prop = prop[type];
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
 */
SKILL.prototype.disenable = function (me, type) {
    this.on_disenable && this.on_disenable(me, type);
    var lv = me.query_skill(this.id);
    var prop = this.query_enable_prop(lv);
    if (prop) {
        var enable_prop = prop[type];
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
SKILL.prototype.do_learn = function (me) {
    if (this.on_learn && this.on_learn(me) === false) return false;
    if (this.learn_condition) {
        for (var key in this.learn_condition) {
            var val = this.learn_condition[key];
            switch (key) {
                case "skill":
                    for (var sk in val) {
                        if (me.query_skill(sk, 0) < val[sk] && me.query_skill(sk + "2", 0) < val[sk]) {
                            var sk_base = SKILL.get(sk);

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
                    var me_val = me[key] || 0;
                    me_val = me_val + me.query_prop(key);
                    if (!me_val || me_val < val) {

                        return me.notify_fail("你的" + PROPERTIES[key] + "不够" + val + "，无法学习" + this.color_name + "。");
                    }
                    break;
            }
        }
    } else {
        if (this.type === SKILL_TYPES.SKILL && this.can_enables) {
            for (var i = 0; i < this.can_enables.length; i++) {
                if (!me.query_skill(this.can_enables[i], 0)) {
                    var skill = SKILL.get(this.can_enables[i]);
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
SKILL.prototype.condition_tostring = function (me) {
    if (this.learn_condition_string) return this.learn_condition_string;
    var str = [];
    if (this.learn_condition) {
        for (var key in this.learn_condition) {
            var val = this.learn_condition[key];
            switch (key) {
                case "skill":
                    for (var sk in val) {
                        var sk_base = SKILL.get(sk);
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
 */
SKILL.prototype.item_to_json = function (str, skill_item, me) {
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
        for (var i = 0; i < this.can_enables.length; i++) {
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
SKILL.prototype.add_exp = function (me, exp) {
    var skill = me.skills[this.id];
    if (!skill) {
        skill = {
            level: 0,
            exp: 0
        };
        var str = ['{type:"dialog",dialog:"skills",item:'];
        this.item_to_json(str, skill, me);
        str.push("}");
        me.notify(str.join(""));
        me.skills[this.id] = skill;
        if (this.type === SKILL_TYPES.BASE) {
            me.init_skill();
        }
    }
    var need_exp = this.level_exp(skill.level, me);
    skill.exp += exp;
    if (skill.exp >= need_exp) {
        this.release_prop(me, me.query_skill(this.id));
        var sum_score = 0;
        var color_name = this.query_color_name(me);
        var one_score = this.query_one_score(me);
        while (skill.exp >= need_exp) {
            skill.exp -= need_exp;
            need_exp = this.level_exp(skill.level, me);
            me.notify("<hiy>你的" + color_name + "等级提升了！</hiy>");
            skill.level++;
            if (skill.level > 100)
                sum_score += one_score;
        }
        var lv = me.query_skill(this.id);
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
SKILL.prototype.query_score = function (lv, me) {
    if (lv <= 100) return 0;
    return (lv - 100) * this.query_one_score(me);
}

/**
 * 查询每级积分
 * @param {CHARACTER} me
 * @returns {number}
 */
SKILL.prototype.query_one_score = function (me) {
    var sc = 0;
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
SKILL.prototype.grade_up = function (me, target_skill) {
    var skill = me.skills[this.id];
    if (!skill || !(skill.level >= 1000)) return false;

    if (me.remove_skill(this.id) === false) return false;
    me.notify('{type:"dialog",dialog:"skills",remove:"' + this.id + '"}');
    var pot = this.query_needexp(skill.level, me);
    var lv = pot * 2 / 5 / (target_skill.grade + 1);
    skill = {
        level: parseInt(Math.pow(lv, 0.5)),
        exp: 0
    };
    me.skills[target_skill.id] = skill;
    var str = ['{type:"dialog",dialog:"skills",item:'];
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
SKILL.prototype.get_pfm = function (name) {
    if (this.pfm) {
        return this.pfm[name];
    }
}

/**
 * 设置绝招
 * @param {string} name
 * @param {PERFORM} obj
 */
SKILL.prototype.set_pfm = function (name, obj) {
    if (!this.pfm) {
        this.pfm = {};
    }
    this.pfm[name] = obj;
}

/** @type {string[]} 品级颜色 */
var level_color = ["wht", "hig", "hic", "hiy", "hiz", "hio", "ord"];
/** @type {string[]} 品级描述 */
var level_desc = ["基本技能", "普通技能", "高级技能", "稀有武技", "绝世武功", "绝世神功", "无上神武"];

/**
 * 技能创建回调
 * @param {string} fname
 */
SKILL.prototype.create = function (fname) {
    if (WORLD.SKILLS[this.id]) {
        console.log("%s [%s] is repeated ", this.id, fname);
    }
    this.update(fname);
}

/** 按品级和基本技能类型存储 */
SKILL.prototype.store = function () {
    if (this.type === SKILL_TYPES.KNOWLEDGE
        || this.type === SKILL_TYPES.BASE
    ) return;
    for (var i = 0; i < this.can_enables.length; i++) {
        if (!SKILL[this.can_enables[i]]) SKILL[this.can_enables[i]] = new Array(7);
        if (!SKILL[this.can_enables[i]][this.grade]) SKILL[this.can_enables[i]][this.grade] = [];
        SKILL[this.can_enables[i]][this.grade].push(this);
    }
}

/**
 * 技能注册/更新
 * @param {string} fname
 */
SKILL.prototype.update = function (fname) {
    WORLD.SKILLS[this.id] = this;
    var fam = this.family || FAMILIES.NONE;
    if (!fam.skills2) fam.skills2 = [];
    if (!fam.skills) fam.skills = [];
    if (!fam.skills3) fam.skills3 = [];
    if (!fam.skills4) fam.skills4 = [];
    var isAddIn = false;
    var ary = this.source_skill ?
        (this.is_ultimate ? fam.skills3 : fam.skills2) :
        (this.is_ultimate ? fam.skills4 : fam.skills);
    if (this.type === SKILL_TYPES.KNOWLEDGE || this.is_hidden) {
        if (!fam.skills0) fam.skills0 = [];
        ary = fam.skills0;
    }
    for (var i = 0; i < ary.length; i++) {
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

    var desc = level_color[this.grade];
    this.color_name = "<" + desc + ">" + this.name + "</" + desc + ">";
    if (this.pfm) {
        for (var key in this.pfm) {
            var pfm = this.pfm[key];
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
SKILL.get = function (id) {
    return WORLD.SKILLS[id];
}

/**
 * 查询技能完整描述
 * @param {CHARACTER} me
 * @param {number} lv
 * @returns {string}
 */
SKILL.prototype.query_desc = function (me, lv) {
    var str = [];
    var grd = this.query_grade(me);
    var cc = level_color[grd];
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
    var prop = this.query_prop(lv, me);
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
    var isEnable = this.type === SKILL_TYPES.KNOWLEDGE;
    if (prop) {
        for (var item in prop) {
            var is_enable = me.is_enable_skill(this.id, item);
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
    var sk = me.skills[this.id];
    if (sk && sk.addin && sk.addin.length) {
        str.push("\n<");
        str.push(isEnable ? cc : "blk");
        str.push(">");

        let grd = this.grade + sk.addin.length;
        for (let slot of sk.addin) {
            let item = this.query_slot(slot);
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
            var p_item = this.pfm[item];
            if (!p_item.name) continue;
            this.query_pfm_desc(me, p_item, str, lv);
            str.push("\n\n");

        }
    }
    if (sk && sk.ref) {
        var refs = sk.ref.split("/");
        var sp_skill = SKILL.get(refs[0]);
        if (sp_skill) {
            var pfm = sp_skill.get_pfm(refs[1]);
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
SKILL.prototype.query_slot = function (index) {
    if (index < 500) {
        return SKILL.PROPERTIES[index];
    } else {
        return this.slots ? this.slots[index - 500] : null;
    }
}

/** @type {number} 引用技能冷却系数 */
SKILL.REF_CD = 2;
/** @type {Object<string, *>} 特殊槽位定义 */
SKILL.SLOTS = {};

/**
 * 查询绝招描述
 * @param {CHARACTER} me
 * @param {PERFORM} p_item
 * @param {string[]} str
 * @param {number} lv
 * @param {string} [pname] - 父技能名(引用技能时)
 */
SKILL.prototype.query_pfm_desc = function (me, p_item, str, lv, pname) {
    var canuse = !p_item.check || p_item.check(me, lv) === true;
    var color = canuse ? "hic" : "red";
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


/** @type {function} 绝招基类 */
PERFORM = function () {
    this.name = "";
}
PERFORM.inherits(BASE);

/**
 * 查询绝招名称
 * @param {CHARACTER} me
 * @returns {string}
 */
PERFORM.prototype.query_name = function (me) {
    return this.name;
}

/**
 * 改变绝招冷却时间
 * @param {CHARACTER} me
 * @param {string} id - 绝招ID
 * @param {number} [add_time] - 增加冷却时间(毫秒), 不传则清除
 */
PERFORM.prototype.change_distime = function (me, id, add_time) {
    if (me.is_player) {
        var dis_time = me.temp["pfm/" + id];
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
        for (var i = 0; i < me.auto_skills.length; i++) {
            var item = me.auto_skills[i];
            if (item.pfm === this) {
                if (add_time)
                    item.release_time += add_time;
                else
                    item.release_time = 0;
            }
        }
    }

}
