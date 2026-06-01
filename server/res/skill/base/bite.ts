import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import { SKILL_TYPES } from "../../../core/const.js";

export default class extends SKILL {
    type = SKILL_TYPES.BASE;
    id = "bite";
    name = "野兽扑咬";
    grade = 0;
    desc = "动物类技能";
    family = FAMILIES.MONSTER;
    attack_actions = [
    "$N张嘴朝$n的$l咬去", "$N抬起前爪往$n的$l一抓", "$N往$n的$l狠狠的扑了过去",
    "$N跳起来用前抓往$n的$l抓去", "$N猛的扑向$n的$l"
];
    query_prop = lv => ({ gj: parseInt(lv / 5), mz: parseInt(lv / 5) });

    constructor() {
        super();
        this.set_default(this.id);
    }
}

