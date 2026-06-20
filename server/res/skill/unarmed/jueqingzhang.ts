import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "绝情掌";
    id = "jueqingzhang";
    grade = 2;
    
    desc = "移花宫拳脚功夫";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '迷魂时自身容貌增加2',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '迷魂忙乱时间增加1秒',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.22),
                mz: Math.floor(lv * 0.82),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "迷魂",
            distime: 25000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 迷魂
                // 迷惑敌人，使敌人在11秒内处于忙乱状态
                me.send_room("$N使出「迷魂」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "迷惑敌人，使敌人在11秒内处于忙乱状态";
            },
        },
    };
}
