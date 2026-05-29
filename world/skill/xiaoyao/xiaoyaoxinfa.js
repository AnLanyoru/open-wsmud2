import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES;
this.inherits(SKILL);
this.name = "逍遥心法";
this.id = "xiaoyaoxinfa";
this.grade = 1;
this.force_rad = 0.6;
this.desc = "逍遥派的入门心法";
this.family = FAMILIES.XIAOYAO;
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["force"];
this.query_enable_prop = function (lv) {
    return {
        force: {
            max_hp: lv*3 +30,
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
