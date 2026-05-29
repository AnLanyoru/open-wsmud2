import { SKILL } from "../../../os/skill/skill.js";
import { FAMILIES } from "../../../os/skill/family.js";

export default class extends SKILL {
    name = "韦陀棍";
    id = "weituogun";
    grade = 1;
    family = FAMILIES.SHAOLIN;
    attack_actions = [
    "$N一招<YEL>「黄石纳履」</YEL>，手中$w如蜻蜓点水般，招招向$n的下盘要害点去",
    "$N把$w平提胸口，一拧身，一招<BLU>「勒马停锋」</BLU>，$w猛地撩向$n的颈部",
    "$N一招<HIC>「平地龙飞」</HIC>，全身滴溜溜地在地上打个大转，举棍向$n的胸腹间戳去",
    "$N伏地一个滚翻，一招<HIB>「伏虎听风」</HIB>，$w挟呼呼风声迅猛扫向$n的足胫",
    "$N一招<HIW>「流星赶月」</HIW>，身棍合一，棍端逼成一条直线，流星般向顶向$n的$l",
    "$N双手持棍划了个天地大圈，一招<RED>「红霞贯日」</RED>，一棍从圆心正中击出，撞向$n的胸口",
    "$N一招<YEL>「投鞭断流」</YEL>，$w高举，以雷霆万钧之势对准$n的天灵当头劈下",
    "$N潜运真力，一招<HIW>「苍龙归海」</HIW>，$w顿时长了数丈，矫龙般直射$n的胸口"

];
    desc = "少林寺七十二绝技之韦陀棍";
    can_enables = ["club"];
    learn_condition = {
    max_mp: 700,
    skill: {
        club: 50
    }
};
    pfm = {
    wu:
    {
        name: "韦陀伏魔",
        distime: 20000,
        enable_skill: "club",
        mp: 20,
        use: function (me, target, lv) {
            var p = 120 + Math.round((lv / 50));
            var t = (lv * 10 + 2000);
            if (t > 12000) t = 12000;
            if (me.do_attack({
                target: target,
                attack_msg: "<hiy>$N脸色柔和，尽显一派慈祥之意，手中的$W轻旋，恍惚中显出佛家韦陀神像，神光四射，笼罩住$n<hiy>",
                gj: me.gj * p / 100,
                mz: me.mz 
            })) {
                me.end_attack(target);
                target.add_status({
                    id: "busy",
                    is_busy: true,
                    name: "忙乱",
                    duration: t,
                    downside: true,
                    desc:"你手忙脚乱无法招架，攻击"
                });
            }
           
        },
        query_desc: function (me, lv) {
            var p = 120 + Math.round((lv / 50));
            var t = (lv * 10 + 2000) / 1000;
            if (t > 12) t = 12;
            return "韦陀棍之韦陀伏魔，造成" + p + "%攻击力的伤害，命中后震慑敌人使敌人忙乱" + (t) + "秒。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        club: {
            gj: lv + 15
        }
    };
}
}

