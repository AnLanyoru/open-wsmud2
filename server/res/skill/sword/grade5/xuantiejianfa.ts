import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "玄铁剑法";
    id = "xuantiejianfa";
    grade = 5;
    
    desc = "玄铁剑法，重剑无锋，大巧不工，越是平平无奇的剑招，对方越难抗御。如挺剑直刺，只要劲力强猛，威力远比变幻奇妙的剑招威力更大";
    can_enables = ["sword","parry"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + lv * 2,
                mz: 20 + lv * 2,
                str: 5 + Math.floor(lv * 0.33),
                diff_fy_per: 8,
            },
            parry: {
                zj: 10 + lv * 2,
                fy: Math.floor(lv * 2.31),
                fy_per: 13,
                max_hp: lv * 20,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "海潮汹涌",
            distime: 30000,
            enable_skill: "sword",
            mp: 0,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 海潮汹涌
                // 快速对附近敌人攻击多次，每次攻击附加并消耗你当前内力的4%
                me.send_room("$N使出「海潮汹涌」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "快速对附近敌人攻击多次，每次攻击附加并消耗你当前内力的4%";
            },
        },
        pfm_1: {
            name: "重剑无锋",
            distime: 30000,
            enable_skill: "sword",
            mp: 40,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 重剑无锋
                // 重剑打击敌人，命中后使敌方处于残缺状态，降低战斗属性20%，攻击速度20%
                me.send_room("$N使出「重剑无锋」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "重剑打击敌人，命中后使敌方处于残缺状态，降低战斗属性20%，攻击速度20%";
            },
        },
    };
}
