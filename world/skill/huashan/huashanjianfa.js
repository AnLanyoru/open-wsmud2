import { SKILL } from "../../../os/skill/skill.js";
import { FAMILIES } from "../../../os/skill/family.js";

export default class extends SKILL {
    name = "华山剑法";
    id = "huashanjianfa";
    grade = 1;
    is_public = true;
    family = FAMILIES.HUASHAN;
    attack_actions = [
    "$N一招「白云出岫」，手中$w点向$n的$l",
    "$N使出「有凤来仪」，$w闪烁不定，刺向$n的$l",
    "$N一招「天绅倒悬」，$w自上而下划出一个大弧，向$n劈砍下去",
    "$N向前跨上一步，手中$w使出「白虹贯日」直刺$n的$l",
    "$N手中的$w一晃，使出「苍松迎客」直刺$n的$l"

];
    desc = "华山派的基础剑法";
    can_enables = ["sword"];
    learn_condition = {
    max_mp: 1000,
    skill: {
        sword: 50
    }
};
    pfm = {
    jiang:
    {
        name: "剑掌五连环",
        distime: 10000,
        enable_skill: "sword",
        mp: 20,
        release_time:10000,
        use: function(me, target, lv) {
            me.send_room("<CYN>$N使出华山派绝技「剑掌五连环」，身法陡然加快！</CYN>", target);
            var count = 5;
            for (var i = 0; i < count; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    attack_before: "紧跟着"
                });
            }
            me.end_attack(target);
        },
        query_desc: function(me, lv) {
         
            return "华山剑法之剑掌五连环，瞬间出招5次，收招较慢。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        sword: {
            gj: lv + 10
        }
    };
}
}

