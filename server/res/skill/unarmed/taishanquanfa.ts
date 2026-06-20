import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "泰山拳法";
    id = "taishanquanfa";
    grade = 2;
    
    desc = "泰山派的拳法功夫";
    can_enables = ["unarmed","parry"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '泰山压顶根骨大于目标时无视招架',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '你的伤害减免将增加泰山压顶的伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.31),
                str: 5 + Math.floor(lv * 0.12),
                fy: Math.floor(lv * 1.51),
            },
            parry: {
                zj: Math.floor(lv * 1.31),
                fy: Math.floor(lv * 1.2),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "泰山压顶",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 100,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 泰山压顶
                // 对敌人造成你攻击力附加你200%防御的伤害
                me.send_room("$N使出「泰山压顶」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成你攻击力附加你200%防御的伤害";
            },
        },
    };
}
