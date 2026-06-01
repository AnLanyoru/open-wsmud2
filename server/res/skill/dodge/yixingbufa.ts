import { SKILL } from "../../../core/skill/skill.js";

export default class extends SKILL {
    name = "意形步法";
    id = "yixingbufa";
    grade = 1;
    dodge_actions = [
    "$n漫不经心的向左迈出一步，刚好避过$N的凌厉攻势。",
    "可是$n不紧不慢往右走了一步，躲过了$N这一招。",
    "但是$n身形飘忽，轻轻一纵，早已避开。",
    "$n身随意转，倏地往一旁挪开了三尺，避过了这一招。",
    "可是$n侧身一让，$N这一招扑了个空。",
    "却见$n足不点地，往旁窜开数尺，躲了开去。",
    "$n身形微晃，有惊无险地避开了$N这一招。",
    "$n看似无心地信手一拂，肩头微侧，堪堪避过了$N这一招。"
];
    desc = "神龙岛独门轻功身法，模仿毒蛇游走而得名";
    can_enables = ["dodge"];
    learn_condition = {
    max_mp: 500,
    skill: {
        dodge: 50
    }
};

    query_enable_prop(lv) {
    return {
        dodge: {
            ds: lv + 5
        }
    };
}
}
