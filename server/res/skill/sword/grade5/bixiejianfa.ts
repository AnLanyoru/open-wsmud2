import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "辟邪剑法";
    id = "bixiejianfa";
    grade = 5;
    
    desc = "渡元禅师从葵花宝典残本中领悟出来的一套剑法，迅捷诡异(未完善)";
    can_enables = ["sword","parry"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];
    learn_condition = {
      "dex1": 50
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + lv * 2,
                mz: Math.floor(lv * 1.52),
                dex: Math.floor(lv * 0.127),
                bj_per: 8,
                desc: "你的攻击会快速攻击多次",
            },
            parry: {
                zj: Math.floor(lv * 2.31),
                diff_sh_per: 4,
                dex: Math.floor(lv * 0.127),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "刺目",
            distime: 45000,
            enable_skill: "sword",
            mp: 20,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 刺目
                // 快速出剑，攻击敌方双目，刺中后使敌人在13秒内处于失明状态，无法躲闪，无法命中敌人，必定暴击
                me.send_room("$N使出「刺目」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "快速出剑，攻击敌方双目，刺中后使敌人在13秒内处于失明状态，无法躲闪，无法命中敌人，必定暴击";
            },
        },
    };
}
