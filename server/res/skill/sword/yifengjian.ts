import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "移风剑法";
    id = "yifengjian";
    grade = 3;
    
    desc = "移花宫剑法绝技";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '移风起栖结束后增加自己的攻速10%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '每20点容貌增加一次移风起栖的攻击次数',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: Math.floor(lv * 1.32),
                mz: Math.floor(lv * 1.12),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "移风起栖",
            distime: 20000,
            enable_skill: "sword",
            mp: 10,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 移风起栖
                // 瞬间内对敌人快速攻击7次，攻击中命中增加100%
                me.send_room("$N使出「移风起栖」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "瞬间内对敌人快速攻击7次，攻击中命中增加100%";
            },
        },
    };
}
