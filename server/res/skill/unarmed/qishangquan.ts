import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "七伤拳";
    id = "qishangquan";
    grade = 3;
    
    desc = "金毛狮王谢逊习自崆峒派的绝技，伤敌一百自损八十";
    can_enables = ["unarmed","parry"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '七伤前六拳附加的伤害增加20%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '七伤总诀触发时忽视对方50%防御',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.61),
                str: 5 + Math.floor(lv * 0.12),
                max_hp: lv * 10,
            },
            parry: {
                zj: Math.floor(lv * 1.61),
                fy: Math.floor(lv * 1.2),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "七伤",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 100,
            release_time: 7000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 七伤
                // 先伤己，再伤人，一拳七伤，七者皆伤，损心伤肺摧肝肠，每拳自身受到20%伤害，每命中一拳增加总诀式50%伤害
                me.send_room("$N使出「七伤」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "先伤己，再伤人，一拳七伤，七者皆伤，损心伤肺摧肝肠，每拳自身受到20%伤害，每命中一拳增加总诀式50%伤害";
            },
        },
    };
}
