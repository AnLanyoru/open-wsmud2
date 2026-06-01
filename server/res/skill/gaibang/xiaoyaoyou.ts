import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class extends SKILL {
    name = "逍遥游";
    id = "xiaoyaoyou";
    grade = 2;
    family = FAMILIES.GAIBANG;
    dodge_actions = [
    "$n一个「蜻蜓点水」，躲过了$N这一招。",
        "$n身形向后一纵，使出一招「细胸巧翻云」，避过了$N的攻击。",
        "$n使出「虚怀若谷」，恰好躲过了$N的攻势。",
        "但是$n身形飘忽，轻轻一纵，早已避开。",
        "$n身形微晃，有惊无险地避开了$N这一招。"
];
    can_enables = ["dodge"];
    learn_condition = {
    max_mp: 1000,
    skill: {
        dodge: 200
    }
};
    pfm = {
    lingbo:
    {
        name: "仙游",
        distime: 30000,
        enable_skill: "dodge",
        mp: 20,
        release_time:0,
        use: function (me, target, lv) {

            var gj = lv * 10 + 10000;

            me.add_status({
                id: "dodge",
                name: "仙游",
                start_msg: "<hiw>$N身子微晃，施出「<hig>仙游诀</hig>」满场游走，步法洋洋洒洒，甚为飘逸。</hiw>",
                desc: "逍遥游之仙游决，增加你的命中",
                duration: gj,
                prop: {
                    mz: lv
                }
            });
        },
        query_desc: function (me, lv) {
            var gj = lv * 10 + 10000;
            return "" + (gj / 1000) + "秒内增加你" + lv + "命中。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        dodge: {
            ds: parseInt(lv * 1.5) + 30,
            mz: lv + 3
        }
    };
}
}

