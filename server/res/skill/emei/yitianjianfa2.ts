import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "倚天剑法";
    id = "yitianjianfa2";
    grade = 5;
    family = FAMILIES.EMEI;
    desc = "峨眉派祖师郭襄在得到倚天剑后自创的一式剑法，招式狠辣，不留余地。";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 30 + lv * 2,
                mz: Math.floor(lv * 1.82),
                mz_per: 8,
                add_bjsh_per: 12,
                desc: "命中敌人后会使敌方防御减少1%，伤害加深1%，可叠加最高20层",
            },
            // Global/base properties:
            // {"diff_fy_per":8} 
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "倚天剑决",
            distime: 15000,
            enable_skill: "sword",
            mp: 10,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 倚天剑决
                // 倚天剑决，瞬间对所有敌人攻击4次，命中增加25%,每次攻击伤害增加50%
                me.send_room("$N使出「倚天剑决」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "倚天剑决，瞬间对所有敌人攻击4次，命中增加25%,每次攻击伤害增加50%";
            },
        },
        pfm_1: {
            name: "号令天下",
            distime: 30000,
            enable_skill: "sword",
            mp: 10,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 号令天下
                // 对敌人造成伤害，每层伏魔增加30%伤害和命中，命中后伏魔重置，驱除对方的有益状态
                me.send_room("$N使出「号令天下」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成伤害，每层伏魔增加30%伤害和命中，命中后伏魔重置，驱除对方的有益状态";
            },
        },
    };
}
