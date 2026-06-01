import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class extends SKILL {
    name = "凌波微步";
    id = "lingboweibu";
    family = FAMILIES.XIAOYAO;
    grade = 3;
    dodge_actions = [
    "只见$n施展凌波微步，步法轻盈，仿佛轻云之蔽月，不知怎的就到了数丈之外。",
    "$n的身影飘飘兮若流风之回雪，施展的正是凌波微步，$N连$n的衣角都沾不到。",
    "但见$n施展凌波微步，左一转，右一斜，就已经绕到了$N的身後。",
    "可是$n施展凌波微步，只是轻描淡写地向旁踏出一步，就巧妙地避开了$N的攻势。",
    "只见$n身影滴溜溜地一转，体迅飞鸟，飘忽若神，施展的正是凌波微步。",
    "$N只觉得眼前一花，头脑发昏，只觉得四面都是$n的身影！",
    "$n左脚轻轻地踏出一步，施展凌波微步，若往若返，把$N牵得团团乱转。"
];
    can_enables = ["dodge"];
    learn_condition = {
    max_mp: 5000,
    skill: {
        dodge: 400
    }
};
    pfm_set = {
    lingbo:
    {
        name: "凌波",
        distime: 40000,
        enable_skill: "dodge",
        release_time: 0,
        mp: 20,
        use: function (me, target, lv) {

            var gj = lv * 10;
            if (gj < 3000) gj = 3000;
            else if (gj > 10000) gj = 10000;

            me.add_status({
                id: "dodge",
                name: "凌波",
                start_msg: "<him>只见$N施展凌波微步，神光离合，乍阴乍阳，动无常则，进止难期。</him>",
                desc: "你施展了施展凌波微步，使敌人无法命中",
                duration: gj,
                on_attach: function (p) {
                    p.change_prop({ ds: 999999 }, true);
                    p.recount();
                },
                on_expire: function (p) {
                    p.change_prop({ ds: 999999 }, false);
                    p.recount();
                }
            });
        },
        query_desc: function (me, lv) {
            var gj = lv * 10;
            if (gj < 3000) gj = 3000;
            else if (gj > 10000) gj = 10000;
            return "全力施展凌波微步，在" + (gj / 1000) + "秒内绝对躲闪敌方攻击。";
        }
    }
};

    query_prop(lv, me) {
    return {
        ds_per: 5 + parseInt(lv / 300)
    };
}
    query_enable_prop(lv) {
    return {
        dodge: {
            dex: parseInt(lv / 5) + 1,
            ds: parseInt(lv * 1.5) + 100
        }
    };
}
}

