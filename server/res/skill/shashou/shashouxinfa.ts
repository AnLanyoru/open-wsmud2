import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class extends SKILL {
    name = "杀手心法";
    id = "shashouxinfa";
    grade = 1;
    force_rad = 0.55;
    desc = "杀手楼的入门心法";
    family = FAMILIES.SHASHOU;
    can_enables = ["force"];
    learn_condition = {
    skill: {
        force: 50
    }
};

    query_enable_prop(lv) {
    return {
        force: {
            gj: 1 + lv,
            limit_mp: lv * 10,
            desc: "唯一：将你内力的55%转化为气血"
        }
    };
}
}

