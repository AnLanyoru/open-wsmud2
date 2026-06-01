import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class extends SKILL {
    name = "华山拳法";
    id = "huashanquanfa";
    grade = 1;
    family = FAMILIES.HUASHAN;
    attack_actions = [
    "$N使一招「云里乾坤」左拳击出，不等招式使老，右拳已从左拳之底穿出，对准$n的$l「呼」地一拳",
    "$N左拳突然张开，拳开变掌，直击化为横扫，一招「雾里看花」便往$n的$l招呼过去",
    "$N步履一沉，左拳虚晃一招，右拳使出「梅花弄影」击向$n$l",
    "$N两手虎口相对，往内一圈，一招「金鼓齐鸣」往$n的$l击出"
];
    desc = "华山派的入门拳法";
    can_enables = ["unarmed"];
    learn_condition = {
    max_mp: 500,
    skill: {
        unarmed: 50
    }
};

    query_enable_prop(lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.1 + 20)
        }
    };
}
}

