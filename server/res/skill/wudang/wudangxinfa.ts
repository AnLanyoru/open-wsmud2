import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class extends SKILL {
    name = "武当心法";
    id = "wudangxinfa";
    grade = 1;
    force_rad = 0.6;
    desc = "武当派的入门心法";
    family = FAMILIES.WUDANG;
    can_enables = ["force"];
    learn_condition = {
    skill: {
        force: 50
    }
};

    query_enable_prop(lv) {
    return {
        force: {
            max_hp: lv*2+120,
            limit_mp: lv * 10,
            desc: "唯一：将你内力的60%转化为气血"
        }
    };
}
}

