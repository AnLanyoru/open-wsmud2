import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "蛤蟆功";
    id = "hamagong";
    grade = 4;
    
    desc = "白驼山的内功心法(未完善)";
    can_enables = ["unarmed","force"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    learn_condition = {
      "str1": 30,
      "con1": 30
    };
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '蛤蟆冲击最少次数增加2次',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '蛤蟆吸气期间额外增加8%免伤',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                fy: Math.floor(lv * 2.1),
                gj: 5 + Math.floor(lv * 1.63),
                limit_mp: lv * 150,
                desc: "唯一：将你内力的70%转化为气血",
            },
            unarmed: {
                gj: 2 + Math.floor(lv * 1.41),
                mz: 2 + Math.floor(lv * 1.41),
                str: Math.floor(lv * 0.2),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "蛤蟆吸气",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 蛤蟆吸气
                // 趴在地上蓄力运功，可最多蓄力9秒，蓄力期间增加25%伤害减免，无法躲闪，招架。
                me.send_room("$N使出「蛤蟆吸气」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "趴在地上蓄力运功，可最多蓄力9秒，蓄力期间增加25%伤害减免，无法躲闪，招架。";
            },
        },
        pfm_1: {
            name: "蛤蟆冲击",
            distime: 5000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 蛤蟆冲击
                // 蓄力后可冲击敌人，每蓄力多１秒，增加你15％的伤害，15%命中，增加一次攻击
                me.send_room("$N使出「蛤蟆冲击」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "蓄力后可冲击敌人，每蓄力多１秒，增加你15％的伤害，15%命中，增加一次攻击";
            },
        },
    };
}
