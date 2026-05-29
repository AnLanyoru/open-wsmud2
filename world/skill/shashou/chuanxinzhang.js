import { SKILL } from "../../../os/skill/skill.js";
import { FAMILIES } from "../../../os/skill/family.js";
import { WEAPON_TYPE } from "../../../os/const.js";

export default class extends SKILL {
    name = "穿心掌";
    id = "chuanxinzhang";
    grade = 2;
    family = FAMILIES.SHASHOU;
    attack_actions = [
    "$N使出一招「破山刀」，运掌如飞，招招直打$n的$l",
    "$N使出一招「碎石手」，双掌急运内力，带着凛冽的掌风直拍$n的$l",
    "$N惨然一声长啸，一招「摄魄掌」，双掌猛然击下，直扑$n的要脉",
    "$N骨骼暴响，双臂忽然暴长数尺，一招「追魂掌」直直攻向$n的$l",
    "$N施展出一招「撩阴掌」，双掌缤纷拍出，陡然间双掌已至$n跟前"
];
    desc = "杀手楼的拳脚功夫，出招阴狠毒辣";
    can_enables = ["unarmed", "parry"];
    learn_condition = {
    max_mp: 2000,
    skill: {
        unarmed: 100
    }
};
    pfm = {
    chuan:
    {
        name: "掌心雷",
        distime: 30000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 20,
        release_time: 0,
        use: function (me, target, lv) {

            var p = 100 + parseInt(lv / 100);
            var t = 6000 + lv;
            if (t > 10000) t = 10000;
            var iscirt = false;
            me.do_attack({
                target: target,
                gj: me.gj * p / 100,
                attack_msg: "<hir>$N暗藏真气于掌心，一招「掌心雷」闪烁着雷光直贯$n</hir>",
                mz: me.mz,
                cirt: function (t, part) {
                    iscirt = me.crit(t, part, me.bj);
                    return iscirt;
                },
                no_weapon: true
            });
            if (iscirt) {
                target.add_status({
                    id: "faint",
                    is_faint: true,
                    duration: t,
                    no_weapon: true,
                    name: "昏迷", downside: true,
                    finish_msg: "<hiy>慢慢的$N又恢复了知觉...</hiy>\n",
                    start_msg: "<hir>$N只觉得眼前一黑，接着什么都不知道了。</hir>\n"
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var p = 100 + parseInt(lv / 100);
            var t = 6 + parseInt(lv / 1000);
            if (t > 10) t = 10;
            return "对敌人造成" + p + "%攻击力的伤害，如果暴击则昏迷对方" + t + "秒";
        }
    }
};

    query_enable_prop(lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.2) + 20,
            bj_per: 1 + parseInt(lv / 300)
        }, parry: {
            zj: parseInt(lv * 1.2) + 20,
            dex: parseInt(lv / 7) + 2
        }
    };
}
}

