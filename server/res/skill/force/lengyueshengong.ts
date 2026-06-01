import { SKILL } from "../../../core/skill/skill.js";

export default class extends SKILL {
    name = "冷月神功";
    id = "lengyueshengong";
    grade = 1;
    force_rad = 0.6;
    desc = "关外胡家的内功心法";
    can_enables = ["force"];
    learn_condition = {
    max_mp:200,
    skill: {
        force: 50
    }
};

    query_enable_prop(lv) {
    return {
        force: {
            max_hp: lv * 5,
            limit_mp: lv * 20,
            desc: "唯一：将你内力的60%转化为气血"
        }
    };
}
}
