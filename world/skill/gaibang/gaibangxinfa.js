import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES;
this.inherits(SKILL);
this.name = "丐帮心法";
this.id = "gaibangxinfa";
this.grade = 1;
this.force_rad = 0.5;
this.desc = "丐帮的入门心法";
this.family = FAMILIES.GAIBANG;
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["force"];
this.query_enable_prop = function (lv) {
    return {
        force: {
            fy: lv+10,
            limit_mp: lv * 10,
            desc: "唯一：将你内力的50%转化为气血"
        }
    };
}
this.learn_condition = {
    skill: {
        force: 50
    }
};
}
