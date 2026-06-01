import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class extends SKILL {
    name = "达摩剑";
    id = "damojian";
    grade = 2;
    family = FAMILIES.SHAOLIN;
    attack_actions = [
    "$N使一式<MAG>「万事随缘往」</MAG>，手中$w嗡嗡微振，幻成一条疾光刺向$n的$l",
    "$N错步上前，使出<HIC>「来去若梦行」</HIC>，剑意若有若无，$w淡淡地向$n的$l挥去",
    "$N一式<YEL>「浮世沧桑远」</YEL>，纵身飘开数尺，运发剑气，手中$w遥摇指向$n的$l",
    "$N纵身轻轻跃起，一式<BLU>「轮回法舟轻」</BLU>，剑光如轮疾转，霍霍斩向$n的$l",
    "$N手中$w中宫直进，一式<HIW>「水月通禅寂」</HIW>，无声无息地对准$n的$l刺出一剑",
"$N手中$w斜指苍天，剑芒吞吐，一式<HIM>「鱼龙听梵音」</HIM>，对准$n的$l斜斜击出",
"$N左指凌空虚点，右手$w逼出丈许雪亮剑芒，一式<GRN>「千里一苇去」</GRN>刺向$n的$l",
"$N合掌跌坐，一式<HIG>「禅心顿自明」</HIG>，$w自怀中跃出，如疾电般射向$n的胸口"

];
    desc = "少林寺七十二绝技之达摩剑";
    can_enables = ["sword"];
    learn_condition = {
    max_mp: 2000,
    skill: {
        sword: 200
    }
};
    pfm_set = {
    jiang:
    {
        name: "三绝剑",
        distime: 10000,
        enable_skill: "sword",
        mp: 20,
        use: function (me, target, lv) {
            me.send_room("<hic>$N使出达摩剑的绝技「达摩三绝剑」，身法陡然加快！</hic>", target);
            var count = 3;
            for (var i = 0; i < count; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {

            return "达摩剑之三绝剑，瞬间出招3次。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        sword: {
            gj: lv + 10,
            str: parseInt(lv / 10) + 2,
            mz: lv+10,
        }
    };
}
}

