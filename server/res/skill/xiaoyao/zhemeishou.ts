import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import { WEAPON_TYPE } from "../../../core/const.js";

export default class extends SKILL {
    name = "天山折梅手";
    id = "zhemeishou";
    family = FAMILIES.XIAOYAO;
    grade = 2;
    attack_actions = [
    "$N一招「<RED>黄昏独自愁</RED>」，身子跃然而起，抓向$n的头部",
    "$N一招「<YEL>梅花雪落覆白苹</YEL>」，双手合击，$n只觉无处可避",
    "$N一招「<HIC>砌下落梅如雪乱</HIC>」，双手飘然抓向$n",
    "$N双手平举，一招「<HIW>云破月来花弄影</HIW>」击向$n",
    "$N左手虚晃，右手一记「<MAG>红颜未老恩先绝</MAG>」击向$n的头部",
    "$N施出「<RED>虚妄笑红</RED>」，右手横扫$n的$l，左手攻向$n的胸口"
];
    parry_actions = [
    "$n一招「<GRN>寒山一带伤心碧</GRN>」，双手纷飞，$N只觉眼花缭乱，无处下手",
    "$n一招「<BLK>吹梅笛怨</BLK>」，双手横挥，扫开$N",
    "$n施出「<YEL>玉石俱焚</YEL>」，不顾一切扑向$N，$P急忙收招防护",
    "$n一招「<WHT>花开堪折直须折</WHT>」，拿向$N的$W，$P一见急忙收招",

];
    desc = "逍遥派手法，三路掌法，三路擒拿，号称可化解天下招数武功";
    can_enables = ["unarmed", "parry"];
    learn_condition = {
    max_mp: 1000,
    skill: {
        unarmed: 100,
        parry: 100
    }
};
    pfm_set = {
    duo:
    {
        name: "空手入白刃",
        distime: 16000,
        enable_skill: "parry",
        mp: 20,
        use: function (me, target, lv) {
            var weap = target.query_weapon();
            if (!weap || weap.weapon_type === WEAPON_TYPE.NONE) return me.notify("对方没有兵刃，你不用担心。");
            if (target.attack_skill && target.attack_skill.id === 'dugujiujian4') {
                return me.send_room("<hic>$N使出空手入白刃的绝招, $n手中如无一物，让$P无从下手！\n</hic>", target);
            }
            if (lv + me.random(me.mz) > target.ds) {
                me.send_room("<hic>$N使出空手入白刃的绝招, $n顿时觉得眼前一花，手腕一麻，手中兵刃脱手而出！\n</hic>", target);
                target.unequip(weap, true, 10000);
            } else {
                me.send_room("<cyn>$N使出空手入白刃的绝招, 可是$n的看破了$N的企图，立刻采取守势，使$N没能夺下兵刃。</cyn>", target);
            }
        },
        query_desc: function (me, lv) {

            return "卸下对方兵刃，技能等级越高成功率越高。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        unarmed: {
            gj: lv * 1 + 10,
            mz: lv + 20
        },
        parry: {
            zj: parseInt(lv * 1.3 + 20),
            dex: parseInt(lv / 8) + 1
        }
    };
}
}

