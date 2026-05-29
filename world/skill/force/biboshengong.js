import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    name = "碧波神功";
    id = "biboshengong";
    grade = 2;
    force_rad = 0.7;
    desc = "桃花岛的内功心法";
    can_enables = ["force"];
    learn_condition = {
    max_mp: 2000,
    skill: {
        force: 200
    }
};

    query_enable_prop(lv) {
    return {
        force: {
            max_hp: lv * 5,
            mz:lv,
            fy:lv,
            limit_mp: lv * 60,
            desc: "唯一：将你内力的70%转化为气血"
        }
    };
}
}
