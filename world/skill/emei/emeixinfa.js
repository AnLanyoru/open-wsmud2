import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES;
this.inherits(SKILL);
this.name = "峨眉心法";
this.id = "emeixinfa";
this.grade = 1;
this.force_rad = 0.6;
this.desc = "峨眉派的入门心法";
this.family = FAMILIES.EMEI;
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["force"];
this.query_enable_prop = function (lv) {
    return {
        force: {
            max_hp: lv * 2 + 10,
            limit_mp: lv * 10,
            desc: "唯一：将你内力的60%转化为气血"
        }
    };
}
this.learn_condition = {
    skill: {
        force: 50
    }
};
}
