import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class extends SKILL {
    name = "叫花棒法";
    id = "jiaohuabangfa";
    grade = 1;
    family = FAMILIES.GAIBANG;
    attack_actions = [
    "$N斜里冲前一步，身法诡异，手中$w急速横扫$n的$l",
    "$N忽然直身飞入半空，又忽的飞身扑下，$w攻向$n的$l",
    "$N原地一个后滚翻，身体向$n平飞过去，手中$w指向$n的$l",
    "$N突然一个急转身，$w横扫一圈后挟着猛烈的劲道打向$n而去",
    "$N向前顺势一滚，接着翻身跳起，手里$w斜向上击向$n的$l"

];
    desc = "丐帮的入门棒法";
    can_enables = ["club", "parry"];
    learn_condition = {
    max_mp:500,
    skill: {
        club: 50
    }
};
    pfm = {
    wu:
    {
        name: "绊字决",
        distime: 10000,
        enable_skill: "club",
        mp: 20,
        use: function (me, target, lv) {
            var p = 50 + lv;
            if (me.do_attack({
                target: target,
                attack_msg: "<hic>$N向前顺势一滚，手中$W乱挥，轮出一片棒影横扫$n的下三路<hic>",
                gj: me.gj ,
                mz: me.mz 
            })) {
                me.end_attack(target);
                target.add_status({
                    id: "ban",
                    name: "绊倒",
                    duration: lv * 10 + 2000,
                    prop: {
                        ds:-p
                    },
                    downside: true,
                    desc:"你的躲闪降低了"
                });
            }
           
        },
        query_desc: function (me, lv) {
            var p = 50+lv;
            return "攻击敌方下三路，命中后减少对方"+p+"躲闪。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        club: {
            gj: lv + 10
        },
        parry: {
            zj: lv + 10
        }
    };
}
}

