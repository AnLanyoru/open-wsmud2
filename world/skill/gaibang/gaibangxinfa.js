import { SKILL } from "../../../os/skill/skill.js";
import { FAMILIES } from "../../../os/skill/family.js";

export default class extends SKILL {
    name = "丐帮心法";
    id = "gaibangxinfa";
    grade = 1;
    force_rad = 0.5;
    desc = "丐帮的入门心法";
    family = FAMILIES.GAIBANG;
    can_enables = ["force"];
    learn_condition = {
    skill: {
        force: 50
    }
};

    query_enable_prop(lv) {
    return {
        force: {
            fy: lv+10,
            limit_mp: lv * 10,
            desc: "唯一：将你内力的50%转化为气血"
        }
    };
}
}

