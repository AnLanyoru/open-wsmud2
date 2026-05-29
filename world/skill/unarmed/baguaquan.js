import { SKILL } from "../../../os/skill/skill.js";
import { WEAPON_TYPE } from "../../../os/const.js";

export default class extends SKILL {
    name = "八卦拳";
    id = "baguaquan";
    grade = 2;
    attack_actions = [
    "$N双掌一错，使出「乾字决」，双拳一上一下对准$n的$l连拍三招",
    "$N绕着$n一转，满场游走，拳出如风，连绵不绝地击向$n，正是八卦拳中的「坤字决」",
    "$N使出一招「巽字决」，左拳虚击$n的前胸，一错身，右拳迅速横扫$n的太阳穴",
    "$N使一招「坎字决」左拳击出，不等招式使老，右拳已从左拳之底穿出，对准$n的$l「呼」地一拳",
    "$N使出一招「震字决」，身形一低，左手护顶，右手已迅雷不及掩耳的一拳击向$n的裆部",
    "$N左拳突然张开，拳开变掌，直击化为横扫，一招「兑字决」便往$n的$l招呼过去",
    "$N一招「离字决」，顿时幻出重重拳影，气势如虹，铺天盖地袭向$n全身",
    "$N微微一笑，手捏「艮字决」，飞身跃起，半空中一脚踢向$n面门，却是个虚招。说时迟那时快，只见$N一个倒翻，双拳已到了$n的$l"
];
    desc = "以阴阳八卦为基础创造出来的一式拳法";
    can_enables = ["unarmed"];
    learn_condition = {
    max_mp: 200,
    skill: {
        unarmed: 300
    }
};
    slots = [
    {
        prop: 'bgq_mz',
        value: (lv) => 10,
        format: (val) => {
            return '震字诀命中增加10%';
        },
    },
    {
        prop: 'bgq_nl',
        value: (lv) => 5,
        format: (val) => {
            return '震字诀附加的内力增加5%';
        },
    }
];
    pfm = {
    zhen:
    {
        name: "震字诀",
        distime: 20000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 20,
        use: function (me, target, lv) {

            var t = 10 + parseInt(lv / 100);
            if (t > 20) t = 20;
            let mz = me.mz + me.mz * me.query_prop("bgq_mz") / 100;
            let add_mp = me.max_mp * t / 100;
            let is_nl = me.query_prop("bgq_nl");
            if (is_nl > 0) add_mp += me.max_mp * is_nl / 100;
            me.do_attack({
                target: target,
                gj: 1,
                attack_msg: "<hiy>只见$N跨立马步，双拳蓄力大喝一声向$n的胸前击去。</hiy>",
                damage_msg: "<hir>只听砰的一声，$N已经重重打中$p胸口，跟着喀喇喇几声，肋骨好像断了几根！</hir>",
                mz: mz,
                no_weapon: true,
                power_gj: add_mp
            });
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var t = 10 + parseInt(lv / 100);
            if (t > 20) t = 20;
            return "对敌人造成你" + t + "%最大内力的伤害。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.2) + 20,
            mz: parseInt(lv * 1.2) + 20
        }
    };
}
}

