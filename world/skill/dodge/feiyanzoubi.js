import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES;
this.inherits(SKILL);
this.name = "飞檐走壁";
this.id = "feiyanzoubi";
this.grade = 1;

this.family = FAMILIES.GAIBANG;
this.dodge_actions = [
    "$n身形急转，避过了$N的攻势。",
    "可是$n拔地而起，躲过了$N这一招。。",
    "$n作闪右避，总算躲过了$N这一招。"
];
this.desc = "江湖中常见的轻功身法。";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["dodge"];
this.learn_condition = {
    max_mp: 700,
    skill: {
        dodge:50
    }
};
this.query_enable_prop = function (lv) {
    return {
        dodge: {
            ds: lv +5
        }
    };
}
}
