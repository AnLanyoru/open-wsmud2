import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import { WEAPON_TYPE } from "../../../core/const.js";

export default class extends SKILL {
    name = "九阴白骨爪";
    id = "jiuyinbaiguzhao";
    grade = 3;
    family = FAMILIES.EMEI;
    attack_actions = [
    "$N左爪虚晃，右爪蓄力，一招「勾魂夺魄」直插向$n的$l",
    "$N双手连环成爪，爪爪钩向$n，「九子连环」已向$n的$l抓出",
    "$N双手使出「十指穿心」，招招不离$n的$l",
    "$N身形围$n一转，使出「天罗地网」，$n的$l已完全笼罩在爪影下",
    "$N使一招「风卷残云」，双爪幻出满天爪影抓向$n全身",
    "$N吐气扬声，一招「唯我独尊」双爪奋力向$n天灵戳下"
];
    desc = "九阴真经里记载的外门功夫，阴狠毒辣";
    can_enables = ["unarmed", "parry"];
    learn_condition = {
    max_mp:5000,
    skill: {
        unarmed: 300
    }
};
    pfm_set = {
    duo:
    {
        name: "夺命",
        distime: 18000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 20,
        use: function (me, target, lv) {
            var gj = me.gj * (200 + lv / 10)/100;
            if (me.do_attack({
                target: target,
                    gj: gj,
                mz: me.mz,
                no_weapon: true,
                    attack_msg: "<hiy>$N冷笑数声，手指微微弯曲成爪，身形疾转，飞向$n头顶抓下</hiy>",
                damage_msg:"<hir>$n哪里料到$N竟有如此变招，不及躲闪，被$P抓了个鲜血淋漓，头痛欲裂。</hir>"
            })) {
                target.add_status({
                    id: "miss",
                    name: "夺命",
                    desc: "你无法躲闪",
                    is_rash: true,
                    duration: 8000,
                    downside: true
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var gj = 200 + parseInt(lv / 10);
            return "快速狠辣的攻击，命中后对敌人造成你攻击力" + gj + "%的伤害，在8秒内使敌人无法闪避。";
        }
    }, juan:
    {
        name: "风卷残云",
        distime: 18000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 20,
        use: function (me, target, lv) {
             lv = 30 - lv / 100;
            if (lv < 10) lv = 10;
            var count = parseInt((100 - target.hp * 100 / target.max_hp) / lv) + 3;
            me.send_room("<hir>$N一声厉啸，手指弯曲成爪，身形疾转，双爪化为一片残影，飞向$n抓去</hir>\n", target);
            for (var i = 0; i < count; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    no_weapon: true
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var calcLv = 30 - lv / 100;
            if (calcLv < 10) calcLv = 10;
            return "对敌人进行快速攻击3次，对方的气血每降低" + calcLv + "%，你的攻击次数增加1次";
        }
    }
};

    query_enable_prop(lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.6) + 20,
            mz: parseInt(lv*1.5 + 20)
        },
        parry: {
            zj: parseInt(lv * 1.5) + 20,
            fy: lv + 20
        }
    };
}
}

