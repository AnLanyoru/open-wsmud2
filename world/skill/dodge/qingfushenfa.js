import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    name = "青蝠身法";
    id = "qingfushenfa";
    grade = 2;
    dodge_actions = [
"只见$n一招「福满乾坤」，身形陡然纵起，躲过了$N这一招。",
	"$n一式「五蝠献寿」，身形晃动，向一旁飘出，避开了$N这一招。。",
	"$n使出「洞天福地」，一个空心筋斗向后翻出，避开了$N的凌厉攻势。",
	"$n一招「云龙百蝠」，身随意转，$N只觉眼前一花，$n已绕至$N的身后。"
];
    desc = "明教青翼蝠王成名绝技";
    can_enables = ["dodge"];
    learn_condition = {
    max_mp: 2000,
    skill: {
        dodge: 200
    }
};

    query_enable_prop(lv) {
    return {
        dodge: {
            ds:parseInt(lv * 1.8) + 100,
            dex:parseInt(lv/10)
        }
    };
}
}
