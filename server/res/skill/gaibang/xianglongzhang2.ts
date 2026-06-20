import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "降龙十八掌";
    id = "xianglongzhang2";
    source_skill = "xianglongzhang";
    grade = 5;
    family = FAMILIES.GAIBANG;
    desc = "丐帮的降龙十八掌，至刚至猛，威震天下";
    can_enables = ["unarmed","parry"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 5 + lv * 2,
                fy: 5 + lv * 2,
                mz: 20 + lv * 2,
                str: 3 + Math.floor(lv * 0.25),
            },
            parry: {
                zj: 5 + lv * 2,
                fy: Math.floor(lv * 2.1),
                diff_sh_per: 4,
            },
            // Global/base properties:
            // {"gj_per":8} 
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "降龙",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 30,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 降龙
                // 以强劲的掌力猛击敌人，如果敌人招架失败，将在7秒无法防御。
                me.send_room("$N使出「降龙」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "以强劲的掌力猛击敌人，如果敌人招架失败，将在7秒无法防御。";
            },
        },
        pfm_1: {
            name: "十八掌",
            distime: 25000,
            enable_skill: "unarmed",
            mp: 30,
            release_time: 4179,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 十八掌
                // 10秒内将十八掌全部打出，掌力会越来越凶猛，每命中一掌最终伤害7%，不论是否命中，命中都增加 7%，攻击中无法躲闪(对NPC伤害递增减半，释放速度加快)
                me.send_room("$N使出「十八掌」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "10秒内将十八掌全部打出，掌力会越来越凶猛，每命中一掌最终伤害7%，不论是否命中，命中都增加 7%，攻击中无法躲闪(对NPC伤害递增减半，释放速度加快)";
            },
        },
    };
}
