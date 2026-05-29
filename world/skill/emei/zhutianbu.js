import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    name = "诸天化身步";
    id = "zhutianbu";
    grade = 1;
    family = FAMILIES.EMEI;
    dodge_actions = [
    "只见$n一招「天地钩」，身体腾空，双足向上，笔直地纵起丈余，躲过了$N这一招。",
    "$n身随意转，一式「凤点头」头部前挺，侧身收腹，倏地往一旁挪开了三尺，避过了这一招。",
    "$n双足抓地，身形微晃，一招「鹰爪松」有惊无险地避开了$N这一招。\n",
    "但是$n身形飘忽，一式「风摆柳」，轻轻一纵，早已避开。",
    "$n一个「阴阳箭」，向后纵出数丈之远，避开了$N的凌厉攻势，立即又欺近$N身旁。",
    "$n使出「日月扣」，双手如钩向一旁飘然纵出，轻轻着地。"
];
    desc = "峨眉派轻功身法，如有千万化身。";
    can_enables = ["dodge"];
    learn_condition = {
    max_mp: 600,
    skill: {
        dodge: 50
    }
};

    query_enable_prop(lv) {
    return {
        dodge: {
            ds: lv +10
        }
    };
}
}

const FAMILIES = globalThis.FAMILIES;
