import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "全真剑法";
    id = "quanzhenjianfa";
    grade = 3;
    
    desc = "全真教的镇派剑法";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '三连环每次附加5%内力伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: Math.floor(lv * 1.61),
                int: Math.floor(lv * 0.127),
                mz: 10 + lv * 1,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "三连环",
            distime: 15000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 三连环
                // 瞬间攻击３招，每招增加20%伤害
                me.send_room("$N使出「三连环」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "瞬间攻击３招，每招增加20%伤害";
            },
        },
    };
}
