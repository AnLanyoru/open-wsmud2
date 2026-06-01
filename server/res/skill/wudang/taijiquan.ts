import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import { WEAPON_TYPE } from "../../../core/const.js";

export default class extends SKILL {
    name = "太极拳";
    id = "taijiquan";
    family = FAMILIES.WUDANG;
    grade = 3;
    attack_actions = ["$N使一招「<YEL>揽雀尾</YEL>」，双手划了个半圈，按向$n的$l",
    "$N使一招「<RED>单鞭</RED>」，右手收置肋下，左手向外挥出，劈向$n的$l",
    "$N左手回收，右手由钩变掌，由右向左，使一招「<HIB>提手上式</HIB>」，向$n的$l打去",
    "$N双手划弧，右手向上，左手向下，使一招「<WHT>白鹤亮翅</WHT>」，分击$n的面门和$l",
    "$N左手由胸前向下，身体微转，划了一个大圈，使一招「<HIR>搂膝拗步</HIR>」，击向$n的$l",
    "$N左手由下上挑，右手内合，使一招「<HIG>手挥琵琶</HIG>」，向$n的$l打去",
    "$N左手变掌横于胸前，右拳由肘下穿出，一招「<HIY>肘底看锤</HIY>」，锤向$n的$l",
    "$N左脚前踏半步，右手使一招「<HIB>海底针</HIB>」，指由下向$n的$l戳去",
    "$N一招「<HIM>闪通臂</HIM>」，左脚一个弓箭步，右手上举向外撇出，向$n的$l挥去",
    "$N两手由相对，转而向左上右下分别挥出，右手使一招「<HIC>斜飞式</HIC>」，挥向$n的$l",
    "$N左手虚按，右手使一招「<HIW>白蛇吐信</HIW>」，向$n的$l插去",
    "$N双手握拳，向前向后划弧，一招「<BLK>双峰贯耳</BLK>」打向$n的$l",
    "$N左手虚划，右手一记「<RED>勾裆锤</RED>」击向$n的裆部",
    "$N施出「<GRN>伏虎式</GRN>」，右手击向$n的$l，左手攻向$n的裆部",
    "$N由臂带手，在面前缓缓划过，使一招「<YEL>云手</YEL>」，挥向$n的$l",
    "$N左腿收起，右手使一招「<BLU>金鸡独立</BLU>」，向$n的$l击去",
    "$N右手由钩变掌，双手掌心向上，右掌向前推出一招「<MAG>高探马</MAG>」",
    "$N右手使一式招「<CYN>玉女穿梭</CYN>」，扑身向$n的$l插去",
    "$N右手经腹前经左肋向前撇出，使一招「<WHT>反身撇锤</WHT>」，向$n的$l锤去",
    "$N左手虚按，右腿使一招「<HIR>转身蹬腿</HIR>」，向$n的$l踢去",
    "$N左手向上划弧拦出，右手使一招「<HIG>搬拦锤</HIG>」，向$n的$l锤去",
    "$N使一招「<HIY>栽锤</HIY>」，左手搂左膝，右手向下锤向$n的$l",
    "$N双手先抱成球状，忽地分开右手上左手下，一招「<HIB>野马分鬃</HIB>」，向$n的$l和面门打去",
    "$N左手由胸前向下，右臂微曲，使一招「<HIM>抱虎归山</HIM>」，向$n的$l推去",
    "$N双手经下腹划弧交于胸前，成十字状，一式「<HIC>十字手</HIC>」，向$n的$l打去",
    "$N左脚踏一个虚步，双手交叉成十字拳，一招「<HIW>进步七星</HIW>」，向$n的$l锤去",
    "$N身体向后腾出，左手略直，右臂微曲，使一招「<BLK>倒撵猴</BLK>」，向$n的$l和面门打去",
    "$N双手伸开，以腰为轴，整个上身划出一个大圆弧，\n一招「<RED>转身摆莲</RED>」，将$n浑身上下都笼罩在重重掌影之中",
    "$N双手握拳，右手缓缓收至耳际，左手缓缓向前推出，\n拳意如箭，一招「<GRN>弯弓射虎</GRN>」，直奔$n心窝而去",
    "$N双手在胸前翻掌，由腹部向前向上推出，一招「<YEL>如封似闭</YEL>」，一股劲风直逼$n"

];
    parry_actions = [
    "$p眼见$P$w攻到，当即使出一招「揽雀尾」，右脚实，左脚虚，运起“挤”字诀，粘连粘随，右掌已搭住$P左腕，横劲发出。$N身不由主的向前一冲，跨出两步，方始站定。",
    "不料$p双手一圈，如抱太极，一股雄浑无比的力道组成了一个旋涡，只带得$P在原地急转七八下。",
    "$p「双风贯耳」，连消带打，双手成圆形击出，随即左圈右圈，一个圆圈跟着一个圆圈，大圈、小圈、平圈、立圈、正圈、斜圈，一个个太极圆圈发出，登时便套得$P跌跌撞撞，身不由主的立足不稳。",
    "$p使出一招「云手」，左手高，右手低，一个圆圈已将$P$w套住。",
    "$p觉气息微窒，当下一招「斜飞势」，将$P$w引偏。",
    "$p吸一口气，体内真气流转，右掌挥出，一拒一迎，将$P的力道尽行碰了回去。",
    "$p双掌一翻，使出一招「云手」，双掌柔到了极处，空明若虚，将$P$w的急劲尽数化去。",
    "$p当即双掌一扬，迎着$w接去，待得手掌与$P$w将触未触之际，施出「揽雀尾式」，将$w轻轻拢住，脚下“金鸡独立式”，左足关地，右足悬空，全身急转，宛似一枚陀螺。",
    "就在这电光石火的一瞬之间，$p身子一弓，正是「白鹤亮翅」的前半招，$P的劲力登时落空。",
];
    can_enables = ["unarmed", "parry"];
    learn_condition = {
    max_mp: 1000,
    skill: {
        unarmed: 300,
        taijishengong: 100
    }
};
    pfm = {
    zhen:
    {
        name: "震字决",
        distime: 15000,
        weapon_type: WEAPON_TYPE.UNARMED,
        enable_skill: "unarmed",
        mp: 20,
        use: function (me, target, lv) {
            lv = 10 + parseInt(lv / 100);
            if (lv > 20) lv = 20;
            me.do_attack({
                attack_msg: "<hiy>$N默运神功，使出太极拳「震」字诀，企图以内力震伤$n。</hiy>",
                target: target,
                gj: me.gj,
                damage_msg: "<red>结果$n被$N以内力一震，胸口有如受到一记重锤，连退了五六步！</red>",
                mz: me.mz,
                no_weapon: true,
                power_gj: me.max_mp * lv / 100
            })
            me.end_attack(target);
        },
        query_desc: function (me, lv) {

            lv = 10 + parseInt(lv / 100);
            if (lv > 20) lv = 20;
            var gj = parseInt(me.max_mp * lv / 100);
            return "以内力震伤敌人，造成你攻击力附加你最大内力" + lv + "%(" + gj + ")的伤害。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.3 + 5),
            mz: parseInt(lv * 1.3 + 5),
            str: parseInt(lv / 8)
        }, parry: {
            zj: parseInt(lv * 1.6 + 20),
            fy: lv * 2 + 10,
            max_hp: lv * 10,
            desc: "当你成功招架后，立刻反击敌人，8秒冷却"
        }
    };
}
    on_parry_over(me, target, par) {
    if (par.is_parry) {
        if (!me.query_temp("sk_taijiquan")) {
            me.do_attack({
                target: target,
                attack_msg: "<hiy>$N化守为攻，双手一推一放，顺着$n的攻击把劲气引向$p！</hiy>",
                no_append: true,
                no_append_target: true,
                no_weapon: true

            });
            me.end_attack(target);
            me.set_temp("sk_taijiquan", 1, 8000);
        }
    }
}
}

