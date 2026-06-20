import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "三阴蜈蚣爪";
    id = "sanyinzhua";
    grade = 3;
    
    desc = "星宿派的拳脚功夫，阴狠毒辣";
    can_enables = ["unarmed","parry"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '三阴毒爪命中后使对方中毒，持续3次',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '追魂爪附加的伤害增加51%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.62),
                mz: Math.floor(lv * 1.52),
                dex: 3 + Math.floor(lv * 0.14),
            },
            parry: {
                zj: Math.floor(lv * 1.52),
                fy: 20 + lv * 1,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "三阴毒爪",
            distime: 18000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 三阴毒爪
                // 快速攻击敌人三爪，每爪附加你7%的毒质内力。
                me.send_room("$N使出「三阴毒爪」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "快速攻击敌人三爪，每爪附加你7%的毒质内力。";
            },
        },
        pfm_1: {
            name: "追魂爪",
            distime: 18000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 追魂爪
                // 对敌人造成200%的伤害，敌人气血每减低1%，伤害增加2%
                me.send_room("$N使出「追魂爪」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成200%的伤害，敌人气血每减低1%，伤害增加2%";
            },
        },
    };
}
