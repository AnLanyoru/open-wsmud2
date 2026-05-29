import { SKILL } from "../../../os/skill/skill.js";

export default function() {
this.inherits(SKILL);
this.name = "密宗心法";
this.id = "mizongxinfa";
this.grade = 1;
this.force_rad = 0.6;
this.desc = "密宗的入门心法";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["force"];
this.learn_condition = {
    max_mp: 200,
    skill: {
        force:100
    }
};
this.query_enable_prop = function (lv) {
    return {
        force: {
            max_hp: lv * 3,
            limit_mp: lv * 10,
            desc: "唯一：将你内力的60%转化为气血"
        }
    };
}
}
