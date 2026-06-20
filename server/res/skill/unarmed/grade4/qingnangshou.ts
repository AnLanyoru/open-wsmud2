import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "青囊手";
    id = "qingnangshou";
    grade = 4;
    
    desc = "药王谷独门拳脚功夫，糅合医术点穴之法，刚柔并济暗藏玄机。";
    can_enables = ["unarmed","parry"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '松筋造成的伤害额外增加50%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '剔骨会附加自身150%攻击力的伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 8 + Math.floor(lv * 1.8),
                mz: 5 + Math.floor(lv * 2.21),
                add_sh_per: 8,
            },
            parry: {
                fy: Math.floor(lv * 1.55),
                mz: Math.floor(lv * 1.61),
                con: Math.floor(lv * 0.119),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "松筋",
            distime: 12000,
            enable_skill: "unarmed",
            mp: 80,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 松筋
                // 施展秘传的松筋活脉，命中后造成150%攻击力的伤害并且解除对方的武器或拳脚强化。
                me.send_room("$N使出「松筋」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "施展秘传的松筋活脉，命中后造成150%攻击力的伤害并且解除对方的武器或拳脚强化。";
            },
        },
        pfm_1: {
            name: "剔骨",
            distime: 25000,
            enable_skill: "unarmed",
            mp: 100,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 剔骨
                // 医者仁心，以手代刀无视敌方血肉，使对方受到已损失气血6%的内力伤害。
                me.send_room("$N使出「剔骨」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "医者仁心，以手代刀无视敌方血肉，使对方受到已损失气血6%的内力伤害。";
            },
        },
    };
}
