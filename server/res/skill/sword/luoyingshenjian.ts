import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "落英神剑";
    id = "luoyingshenjian";
    grade = 3;
    
    desc = "桃花岛的剑法";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '落英缤纷的命中增加20%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '落英缤纷额外附加20%攻击力',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: Math.floor(lv * 1.41),
                mz: Math.floor(lv * 1.42),
                dex: Math.floor(lv * 0.127),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "落英缤纷",
            distime: 10000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 落英缤纷
                // 快速攻击敌人5次，等级越高冷却时间越短
                me.send_room("$N使出「落英缤纷」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "快速攻击敌人5次，等级越高冷却时间越短";
            },
        },
    };
}
