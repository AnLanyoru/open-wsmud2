import { OBJ } from "../../../os/item/obj.js";
import { SKILL } from "../../../os/skill/skill.js";
import { SKILL_TYPES } from "../../../os/const.js";

export default class extends OBJ {
    unit = "粒";
    name = "突破丹";
    grade = 1;
    desc = "快速突破你的技能，消耗你的潜能使你的某项不高于突破丹品质的技能增加1-5级";
    value = 1000;
    transable = true;

    on_use(me) {
    me.notify("你吞下一粒突破丹。")
    if (!(me.pot > 0)) return me.notify("你的潜能不够，好像没什么效果。");
    var list = [];
    for (var sk in me.skills) {
        var base_skill = SKILL.get(sk);
        if (base_skill && base_skill.type != SKILL_TYPES.KNOWLEDGE && base_skill.grade <= this.grade) {
            list.push(base_skill);
        }
    }
    var skillbase = list.random();
    if (!skillbase) return me.notify("你还没有学会可以突破的技能。");
    var needexp = 0;
    var level = this.random(15);
    if (level > 13) level = 5;
    else if (level > 11) level = 4;
    else if (level > 8) level = 3;
    else if (level > 4) level = 2;
    else level = 1;
    var now_lv = me.skills[skillbase.id].level;
    while (level) {
        needexp += skillbase.level_exp(now_lv + level, me);
        level--;
    }
    if (needexp > me.pot) return me.notify("你的潜能不够，好像没什么效果。");

    skillbase.add_exp(me, needexp);
    me.pot -= needexp;
}
    on_create(path, par) {
    if (!par) {
        this.path = "drug/skill2#1";
        return;
    }
    par = par.substr(1);
    var lv = parseInt(par);
    if (!(lv > 0 && lv <= 5)) {
        lv = 1;
        this.path = "drug/skill2#1";
    }
    this.grade = lv ? lv : 1;
    this.value = VALUES[this.grade];
}
}

const VALUES = [1000, 1000, 10000, 20000, 50000, 100000, 100000];
