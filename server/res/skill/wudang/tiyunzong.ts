import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class extends SKILL {
    name = "梯云纵";
    id = "tiyunzong";
    family = FAMILIES.WUDANG;
    grade = 2;
    dodge_actions = [
    "只见$n一招「<WHT>白鹤冲天</wht>」，身体向上笔直地纵起丈余，躲过了$N这一招。",
    "$n一个「<RED>鹞子翻身</RED>」，向后纵出数丈之远，避开了$N的凌厉攻势。",
    "$n使出「<MAG>大鹏展翅</MAG>」，向一旁飘然纵出，轻轻着地。",
    "但是$n一招「<WHT>白鹤冲天</wht>」身形飘忽，轻轻一纵，早已避开。",
    "$n身随意转，一招「<RED>鹞子翻身</RED>」倏地往一旁挪开了三尺，避过了这一招。",
    "可是$n一招「<MAG>大鹏展翅</MAG>」侧身一让，$N这一招扑了个空。",
    "却见$n足不点地一招「<MAG>大鹏展翅</MAG>」，往旁窜开数尺，躲了开去。",
    "$n身形微晃，一招「<RED>鹞子翻身</RED>」有惊无险地避开了$N这一招。",
];
    learn_condition = {
    max_mp: 1000,
    skill: {
        dodge: 200
    }
};
    can_enables = ["dodge"];

    query_enable_prop(lv) {
    return {
        dodge: {
            ds: parseInt(lv * 1.5 + 5),

            desc: "当成功躲闪对方攻击时增加" + lv + "躲闪，可叠加"
        }
    };
}
    on_dodge_over(me, target, par) {
    if (par.is_dodge && !me.query_temp("tiyunzong")) {
        var lv = me.query_skill("tiyunzong", 0);
        me.add_status({
            id: "dodge",
            name: "梯云纵",
            desc: "梯云纵之纵字诀，增加你的躲闪",
            prop: {
                ds: lv
            },
            duration: 5000,
            override: 1,
            max_count: 10
        });
        me.set_temp("tiyunzong", 1, me.random(8000) + lv);
    }
}
}

