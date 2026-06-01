import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class extends SKILL {
    name = "混元一气";
    id = "hunyuanyiqi";
    grade = 1;
    force_rad = 0.55;
    desc = "少林寺的内功心法";
    family = FAMILIES.SHAOLIN;
    can_enables = ["force"];
    learn_condition = {
    skill: {
        force: 50
    }
};

    query_enable_prop(lv) {
    return {
        force: {
            max_hp: lv ,
            fy: lv + 5,
            limit_mp: lv * 20,
            desc: "唯一：将你内力的55%转化为气血"
        }
    };
}
}

