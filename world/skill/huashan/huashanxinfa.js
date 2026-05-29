import { SKILL } from "../../../os/skill/skill.js";
import { FAMILIES } from "../../../os/skill/family.js";

export default class extends SKILL {
    name = "华山心法";
    id = "huashanxinfa";
    grade = 1;
    force_rad = 0.5;
    desc = "华山派的入门心法";
    family = FAMILIES.HUASHAN;
    can_enables = ["force"];
    learn_condition = {
    skill: {
        force: 50
    }
};

    query_enable_prop(lv) {
    return {
        force: {
            max_hp: lv,
            limit_mp: lv * 10,
            desc: "唯一：将你内力的50%转化为气血"
        }
    };
}
}

