/*global SKILL_TYPES SKILL BASE PROPERTIES WORLD FAMILIES*/

require("../util/util.js");
SKILL = function () {
    this.id = "";
    this.name = "";
    this.type = SKILL_TYPES.SKILL;
    this.grade = 1;
    this.score = 0;
}
SKILL.inherits(BASE);
SKILL.prototype.query_attack_action = function (me, target) {
    if (this.attack_actions)
        return this.attack_actions.random();
    return "";
}
SKILL.prototype.query_dodge_action = function () {
    if (!this.dodge_actions) {
        return "";
    }
    return this.dodge_actions.random();
}
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

SKILL.prototype.level_exp = function (lv, me) {
    var grd = this.query_grade(me);
    return (lv + 1) * (grd + 1) * 5;
}
SKILL.prototype.query_needexp = function (level, me) {
    if (level > 100) {
        var grd = this.query_grade(me);
        var exp = (100 + level) * (level - 100) / 2;
        return exp * (grd + 1) * 5;
    } else {
        return 0;
    }
}


SKILL.prototype.set_default = function (type) {
    WORLD.DEFAULT_SKILLS[type] = this;
}

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
SKILL.prototype.query_enable_prop = function (lv) {

}
SKILL.prototype.query_prop = function (lv) {

}

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
SKILL.prototype.query_color_name = function (me) {

    var desc = level_color[this.query_grade(me)];
    return "<" + desc + ">" + this.name + "</" + desc + ">";
}

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
SKILL.prototype.is_enable = function (me) {
    if (this.type !== SKILL_TYPES.SKILL) return true;
    var skill = me.skills[this.id];
    for (var i = 0; i < this.can_enables.length; i++) {
        if (skill[this.can_enables[i]]) return true;
    }
    return false;
}
SKILL.prototype.is_enable2 = function (me, baseskill) {
    var skill = me.skills[this.id];

    return skill ? skill[baseskill] : false;
}
//激活技能,附加装备的部分属性
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
    //附加进阶属性
    prop = this.query_addin_prop(me, lv);
    if (prop) {
        if (!this.is_enable(me)) {
            me.change_prop(prop, true);
        }
    }
    return true;
}
//取消激活技能,解除装备的部分属性
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


    //附加进阶属性
    prop = this.query_addin_prop(me, lv);
    if (prop) {
        if (!this.is_enable(me)) {

            me.change_prop(prop, false);
        }
    }
    return true;
}
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
SKILL.prototype.add_exp = function (me, exp) {
    var skill = me.skills[this.id];
    if (!skill) {
        skill = {
            // id: this.id,
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
SKILL.prototype.query_score = function (lv, me) {
    if (lv <= 100) return 0;
    return (lv - 100) * this.query_one_score(me);
}

SKILL.prototype.query_one_score = function (me) {
    var sc = 0;
    if (this.type === SKILL_TYPES.SKILL) {
        sc = this.query_grade(me);
    } else if (this.type === SKILL_TYPES.BASE) {
        sc = 1;
    }
    return sc;
}
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
SKILL.prototype.get_pfm = function (name) {
    if (this.pfm) {
        return this.pfm[name];
    }
}
SKILL.prototype.set_pfm = function (name, obj) {
    if (!this.pfm) {
        this.pfm = {};
    }
    this.pfm[name] = obj;
}
var level_color = ["wht", "hig", "hic", "hiy", "hiz", "hio", "ord"];
var level_desc = ["基本技能", "普通技能", "高级技能", "稀有武技", "绝世武功", "绝世神功", "无上神武"];

SKILL.prototype.create = function (fname) {
    if (WORLD.SKILLS[this.id]) {
        console.log("%s [%s] is repeated ", this.id, fname);
    }
    this.update(fname);
}
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
SKILL.get = function (id) {
    return WORLD.SKILLS[id];
}
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
SKILL.prototype.query_slot = function (index) {
    if (index < 500) {
        return SKILL.PROPERTIES[index];
    } else {
        return this.slots ? this.slots[index - 500] : null;
    }
}
SKILL.REF_CD = 2;
SKILL.SLOTS = {};
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


PERFORM = function () {
    this.name = "";
}
PERFORM.inherits(BASE);

PERFORM.prototype.query_name = function (me) {
    return this.name;
}

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
