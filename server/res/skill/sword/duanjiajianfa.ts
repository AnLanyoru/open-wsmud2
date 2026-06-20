import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "段家剑";
    id = "duanjiajianfa";
    grade = 3;
    
    desc = "大理段家的剑法";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '一阳剑气期间，如果对方躲闪将释放剑气',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '一阳剑气期间，命中后造成额外的内力伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: Math.floor(lv * 1.51),
                mz: Math.floor(lv * 1.61),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "一阳剑气",
            distime: 35000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 一阳剑气
                // 将内力贯入武器，10.1秒内最终伤害40%
                me.send_room("$N使出「一阳剑气」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "将内力贯入武器，10.1秒内最终伤害40%";
            },
        },
        pfm_1: {
            name: "无形剑气",
            distime: 35000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 无形剑气
                // 将内力贯入武器，以剑气伤人，对敌方造成310%的伤害，命中增加100%
                me.send_room("$N使出「无形剑气」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "将内力贯入武器，以剑气伤人，对敌方造成310%的伤害，命中增加100%";
            },
        },
    };
}
