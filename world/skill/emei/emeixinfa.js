import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    name = "峨眉心法";
    id = "emeixinfa";
    grade = 1;
    force_rad = 0.6;
    desc = "峨眉派的入门心法";
    family = FAMILIES.EMEI;
    can_enables = ["force"];
    learn_condition = {
    skill: {
        force: 50
    }
};

    query_enable_prop(lv) {
    return {
        force: {
            max_hp: lv * 2 + 10,
            limit_mp: lv * 10,
            desc: "唯一：将你内力的60%转化为气血"
        }
    };
}
}

const FAMILIES = globalThis.FAMILIES;
