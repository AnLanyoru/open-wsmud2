import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES;
this.inherits(SKILL);
this.name = "降龙十八掌";
this.id = "xianglongzhang";
this.grade = 4;
this.family = FAMILIES.GAIBANG;
this.first_title = "丐帮副帮主";
this.attack_actions = [
    "$N双掌平平提到胸前，神色沉重的缓缓施出「亢龙有悔」推向$n",
    "$N突然身形飞起，双掌居高临下一招「飞龙在天」拍向$n的$l",
    "$N右掌一招「见龙在田」，迅捷无比地劈向$n的$l",
    "$N双掌施出一招「鸿渐于陆」，隐隐带着风声拍向$n的$l",
    "$N左掌聚成拳状，右掌一招「潜龙勿用」缓缓推向$n的$l",
    "$N施出一招「利涉大川」，右掌插腰，左掌劈向$n的$l",
    "$N使出「突如其来」，右掌从不可能的角度向$n的$l推出",
    "$N大吼一声，双掌使出「震惊百里」，不顾一切般击向$n",
    "$N使出降龙十八掌之「或跃在渊」，向$n的$l连续拍出数掌",
    "$N身形滑动，双掌使一招「双龙取水」一前一后按向$n的$l",
    "$N使出「鱼跃于渊」，身形飞起，双掌并在一起向$n的$l劈下",
    "$N双掌立起，使出降龙十八掌中的「时乘六龙」向$n连砍六下",
    "$N使出「密云不雨」，左掌封住$n的退路，右掌斜斜地劈向$l",
    "$N使出降龙十八掌一势「损则有孚」，双掌软绵绵地拍向$n的$l",
    "$N脚下一转，突然欺到$n身前，一招「龙战于野」拍向$n的$l",
    "却见$N门户大开，蓦地施出一招「履霜冰至」向$n的$l劈去",
    "$N嗔目大喝，使出「羝羊触蕃」，双掌由下往上击向$n的$l",
    "$N左掌护胸，右掌使一招「神龙摆尾」上下晃动着击向$n的$l"
];
this.desc = "丐帮的降龙十八掌，至刚至猛，威震天下";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["unarmed", "parry"];
this.learn_condition = {
    max_mp: 20000,
    skill: {
        unarmed: 500
    }
};
this.query_prop = function (lv) {
    return {
        gj_per: 5 + parseInt(lv / 300)
    };
}
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: lv * 2 + 5,
            str: parseInt(lv / 6) + 20,
            mz: parseInt(lv * 1.2) + 20
        },
        parry: {
            zj: lv * 2 + 5,
            fy: lv * 2 + 100
        }
    };
}
this.pfm = {
    qi:
    {
        name: "降龙",
        distime: 30000,
        enable_skill: "unarmed",
        mp: 30,
        release_time: 0,
        use: function (me, target, lv) {
            var time = 2000 + lv * 5;
            if (time > 8000) time = 8000;
            var is_parry = false;
            var sh = me.do_attack({
                target: target,
                gj: me.gj,
                mz: me.mz, no_weapon: true,
                attack_msg: "<hiy>$N大喝一声，双掌齐出，如怒潮般汹涌般向$p当胸猛击过去。</hiy>",
                damage_msg: "<hir>只听砰的一声，$N已经重重打中$p胸口，跟着喀喇喇几声，肋骨好像断了几根！</hir>",
                on_parry: function (t, ispa) {
                    is_parry = ispa;
                    if (ispa)
                        this.damage_msg = "<hir>$n慌乱中匆忙招架，后续掌力却如怒潮狂涌而至，$p心口一甜，喷出一口鲜血。</hir>";
                    return false;
                },
                miss_msg: "<hic>$n大惊之下，$i连划三个半圆护住身前，同时足尖着力，飘身后退，避开了$N的一掌。</hic>"
            });
            if (sh && !is_parry) {
                target.add_status({
                    id: "unarmed",
                    duration: time,
                    name: "降龙",
                    downside: true,
                    is_rash: true,
                    desc: "你无法躲闪"
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var time = 2000 + lv * 5;
            if (time > 8000) time = 8000;
            return " 以强劲的掌力猛击敌人，如果敌人招架失败，将在" + (time / 1000) + "秒内无法躲闪。";
        }
    }, shiba: {

        name: "十八掌",
        distime: 30000,
        enable_skill: "unarmed",
        mp: 30,
        msgs: [
            "<hig>-----亢龙有悔-----</hig>\n$N双掌平平提到胸前，神色沉重的缓缓施出「亢龙有悔」推向$n",
            "<hig>-----飞龙在天-----</hig>\n$N突然身形飞起，双掌居高临下一招「飞龙在天」拍向$n的$l",
            "<hig>-----见龙在田-----</hig>\n$N右掌一招「见龙在田」，迅捷无比地劈向$n的$l",
            "<hic>-----鸿渐于陆-----</hic>\n$N双掌施出一招「鸿渐于陆」，隐隐带着风声拍向$n的$l",
            "<hic>-----潜龙勿用-----</hic>\n$N左掌聚成拳状，右掌一招「潜龙勿用」缓缓推向$n的$l",
            "<hic>-----利涉大川-----</hic>\n$N施出一招「利涉大川」，右掌插腰，左掌劈向$n的$l",
            "<hiy>-----突如其来-----</hiy>\n$N使出「突如其来」，右掌从不可能的角度向$n的$l推出",
            "<hiy>-----震惊百里-----</hiy>\n$N大吼一声，双掌使出「震惊百里」，不顾一切般击向$n",
            "<hiy>-----或跃在渊-----</hiy>\n$N使出降龙十八掌之「或跃在渊」，向$n的$l连续拍出数掌",
            "<hiz>-----双龙取水-----</hiz>\n$N身形滑动，双掌使一招「双龙取水」一前一后按向$n的$l",
            "<hiz>-----鱼跃于渊-----</hiz>\n$N使出「鱼跃于渊」，身形飞起，双掌并在一起向$n的$l劈下",
            "<hiz>-----时乘六龙-----</hiz>\n$N双掌立起，使出降龙十八掌中的「时乘六龙」向$n连砍六下",
            "<hio>-----密云不雨-----</hio>\n$N使出「密云不雨」，左掌封住$n的退路，右掌斜斜地劈向$l",
            "<hio>-----损则有孚-----</hio>\n$N使出降龙十八掌一势「损则有孚」，双掌软绵绵地拍向$n的$l",
            "<hio>-----龙战于野-----</hio>\n$N脚下一转，突然欺到$n身前，一招「龙战于野」拍向$n的$l",
            "<hir>-----履霜冰至-----</hir>\n却见$N门户大开，蓦地施出一招「履霜冰至」向$n的$l劈去",
            "<hir>-----羝羊触蕃-----</hir>\n$N嗔目大喝，使出「羝羊触蕃」，双掌由下往上击向$n的$l",
            "<hir>-----神龙摆尾-----</hir>\n$N左掌护胸，右掌使一招「神龙摆尾」上下晃动着击向$n的$l"
        ], query_releasetime: function (me, lv) {
            lv = lv || me.query_skill("xianglongzhang", 0);
            var t = 12000 - lv * 2;
            if (t <= 8000) return 8000;
            return t;
        },
        use: function (me, target, lv) {
            me.send_room("<hiy>$N凝神聚气，神态淡然，左手虚划，右手回转，聚气于胸前，双掌猛地推出，蕴含着降龙十八掌的十八般变化<hiy>\n");
            me.is_rash = 12000 - lv * 2;
            if (me.is_rash < 8000) me.is_rash = 8000;
            var time = parseInt(me.is_rash / 18);
            var gj = me.gj;
            lv = 105 + parseInt(lv / 500);
            if (lv > 109) lv = 109;
            var $this = this;
            me.call_interval(
                function (i) {
                    target = me.query_enemy();
                    if (!target) {
                        me.is_rash = 0;
                        return false;
                    }
                    if (me.do_attack({
                        target: target,
                        gj: gj,
                        mz: me.mz,
                        attack_msg: $this.msgs[i],
                        no_weapon: true
                    })) {
                        gj = gj * lv / 100;
                    }
                    me.end_attack(target);
                    if (!me.enemy.length) {
                        me.is_rash = 0;
                        return false;
                    }
                    if (i >= 17) me.is_rash = 0;
                },
                time,
                18
            );
        },
        query_desc: function (me, lv) {
            var lv1 = 5 + parseInt(lv / 500);
            if (lv1 > 9) lv1 = 9;
            var time = (12000 - lv * 2) / 1000;
            if (time < 8) time = 8;
            return time + "秒内将十八掌全部打出，掌力会越来越凶猛，每命中一掌增加伤害" + lv1 + "%，攻击中自身无法躲闪";
        }
    }
};
}
