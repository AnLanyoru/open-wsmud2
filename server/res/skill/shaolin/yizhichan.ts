import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import { WEAPON_TYPE } from "../../../core/const.js";

export default class extends SKILL {
    name = "一指禅";
    id = "yizhichan";
    grade = 3;
    family = FAMILIES.SHAOLIN;
    attack_actions = [
    "$N双指并拢，一式<HIY>「佛恩济世」</HIY>，和身而上，左右手一前一后戳向$n的胸腹间",
    "$N左掌护胸，一式<HIY>「佛光普照」</HIY>，右手中指前后划了个半弧，猛地一甩，疾点$n的$l",
    "$N身形闪动，一式<HIY>「佛门广渡」</HIY>，双手食指端部各射出一道青气，射向$n的全身要穴",
    "$N盘膝跌坐，一式<HIY>「佛法无边」</HIY>，左手握拳托肘，右手拇指直立，遥遥对着$n一捺"
];
    desc = "少林寺七十二绝技之一指禅";
    can_enables = ["unarmed"];
    learn_condition = {
    max_mp: 8000,
    skill: {
        unarmed: 300
    }
};
    pfm_set = {
    zhen:
    {
        name: "惊魔一指",
        distime: 30000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 20,
        use: function (me, target, lv) {
            var time = (lv * 5 + 2000);
            if (time > 10000) time = 10000;
            var sh = me.do_attack({
                target: target,
                gj: me.gj,
                mz: me.mz, no_weapon: true,
                attack_msg: "<hiy>$N大喝一声，中指按出，一股锐利的杀气攻向$n，气势恢宏之极！</hiy>",
                damage_msg: "<hir>只见$p躲闪不及，被$P这一指正戳在胸前，不由得连声惨叫，胸口鲜血直流！</hir>",
              
                miss_msg: "<cyn>可是$p身法颇为灵活，轻轻一退将这道剑气化解于无形。</cyn>"
            });
            if (sh ) {
                target.add_status({
                    id: "faint",
                    is_faint: true,
                    duration: time,
                    name: "昏迷", downside: true,
                    finish_msg: "<hiy>慢慢的$N又恢复了知觉...</hiy>\n",
                    start_msg: "<hir>$N只觉得眼前一黑，接着什么都不知道了...</hir>\n"
                }, me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var time = (lv * 5 + 2000);
            if (time > 10000) time = 10000;
            return "一指禅之惊魔一指，运用无形剑气攻击敌人，命中后昏迷" + time/1000+"秒。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.5) + 20,
            str: parseInt(lv / 5) + 1,
            mz: parseInt(lv * 0.8 + 3)
        }
    };
}
}

