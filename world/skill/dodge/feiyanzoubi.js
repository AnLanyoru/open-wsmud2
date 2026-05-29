import { SKILL } from "../../../os/skill/skill.js";
import { FAMILIES } from "../../../os/skill/family.js";

export default class extends SKILL {
    name = "飞檐走壁";
    id = "feiyanzoubi";
    grade = 1;
    family = FAMILIES.GAIBANG;
    dodge_actions = [
    "$n身形急转，避过了$N的攻势。",
    "可是$n拔地而起，躲过了$N这一招。。",
    "$n作闪右避，总算躲过了$N这一招。"
];
    desc = "江湖中常见的轻功身法。";
    can_enables = ["dodge"];
    learn_condition = {
    max_mp: 700,
    skill: {
        dodge:50
    }
};

    query_enable_prop(lv) {
    return {
        dodge: {
            ds: lv +5
        }
    };
}
}

