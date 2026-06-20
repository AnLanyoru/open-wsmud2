import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "恒山剑法";
    id = "hengshanjianfa";
    grade = 3;
    
    desc = "绵密严谨，长于守御，而往往是在最令人出其不意之处突出杀招，剑法绵密有余，凌厉不足，正是适于女子所使用的武功。";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '绵里藏针命中后将触发一次流云七剑',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '绵里藏针的后手将无法躲闪，并增加100%伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 20 + lv * 1,
                mz: Math.floor(lv * 1.7),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "流云七剑",
            distime: 20000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 流云七剑
                // 行云流水般连出七招，每招造成你攻击力63%的伤害
                me.send_room("$N使出「流云七剑」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "行云流水般连出七招，每招造成你攻击力63%的伤害";
            },
        },
        pfm_1: {
            name: "绵里藏针",
            distime: 15000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 绵里藏针
                // 先手示弱对敌人造成83%的伤害，如果未命中，后手会增加你166%的伤害和命中
                me.send_room("$N使出「绵里藏针」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "先手示弱对敌人造成83%的伤害，如果未命中，后手会增加你166%的伤害和命中";
            },
        },
    };
}
