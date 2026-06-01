import { SKILL } from "../../../core/skill/skill.js";

export default class extends SKILL {
    name = "泰山剑法";
    id = "taishanjianfa";
    grade = 3;
    attack_actions = [
    "$N手中$w一晃，向右滑出三步，一招<HIB>「朗月无云」</HIB>，转过身来，身子微矮，$w向$n斜斜刺去",
    "$N手中$w圈转，一招<HIC>「峻岭横空」</HIC>去势奇疾，无数剑光刺向$n的$l",
    "$N突然腰一弯，挺$w向$n刺去，这一剑力劲剑疾，正是一招<HIC>「来鹤清泉」</HIC>",
    "$N手中$w刷的一声，反手砍向$n，剑势圆润如意：<HIY>「石关回马」</HIY>！",
    "$N展开剑势，身随剑走，左边一拐，右边一弯，越转越急。猛地$w剑光暴长，一招<HIM>「泰山十八盘」</HIM>往$n$l刺去",
    "$N手臂暴长，手中$w豁豁展开，刷刷两剑，指向$n，正是<GRN>「快活三里」</GRN>"

];
    desc = "泰山派的剑法";
    can_enables = ["sword"];
    learn_condition = {
    max_mp: 2000,
    skill: {
        sword: 200
    }
};
    slots = [
    {
        prop: "con",
        value: lv => 1 + parseInt(lv / 10),
        format: (val) => {
            return "根骨：+" + val;
        }
    },
    {
        prop: "tsjf_st",
        value: lv => 1,
        count: 1,
        format: (val) => {
            return "七星落长空任意命中后将使对方昏迷7秒";
        }
    }
];
    pfm_set = {
    jiang:
    {
        name: "七星落长空",
        distime: 22000,
        enable_skill: "sword",
        mp: 20,
        use: function (me, target, lv) {
            me.send_room("<hir>$N一招「七星落长空」挺$w向$n当胸刺去，剑光闪烁，$w发出嗡嗡之声，罩住了$n胸口“膻中”、“神藏”、“灵墟”、“神封”、“步廊”、“幽门”、“通谷”七处大穴</hir>", target);
            var count = 7;
            var per = 50 + parseInt(lv / 50);
            var p2 = 3 + parseInt(lv / 500);
            var mz = 0;
            for (var i = 0; i < count; i++) {
                if (me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz
                })) mz++;
            }
            me.end_attack(target);
            if (mz) {
                if (me.query_prop('tsjf_st')) {
                    target.add_status({
                        id: "faint",
                        is_faint: true,
                        duration: 7000,
                        name: "昏迷", downside: true,
                        finish_msg: "<hiy>慢慢的$N又恢复了知觉...</hiy>\n",
                        start_msg: "<hir>$N只觉得眼前一黑，接着什么都不知道了。</hir>\n"
                    }, me);
                } else {
                    var name = "零一二三四五六七"[mz] + "落";
                    target.add_status({
                        id: "sword",
                        name: name,
                        desc: "降低你的躲闪和防御",
                        duration: 10000,
                        prop: {
                            ds_per: -mz * p2,
                            fy_per: -mz * p2
                        }, downside: true
                    }, me);
                }
            }
        },
        query_desc: function (me, lv) {
            var per = 50 + parseInt(lv / 50);
            var p2 = 3 + parseInt(lv / 500);
            return "瞬间七剑攻击敌方要穴，每剑造成" + per + "%伤害，每命中一剑减少敌人" + p2 + "%的躲闪和防御。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        sword: {
            gj: parseInt(lv * 1.5) + 10,
            mz: parseInt(lv * 1.3) + 10,
            fy: parseInt(lv * 1.5) + 10,
        }
    };
}
}
