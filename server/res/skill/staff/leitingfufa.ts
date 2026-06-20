import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "雷霆斧法";
    id = "leitingfufa";
    grade = 2;
    
    desc = "传说中已经消失的开山门绝学，招式大开大合，刚猛无匹";
    can_enables = ["staff"];
    attack_actions = SKILL.get("staff")?.attack_actions || [];
    learn_condition = {
      "skill": {
        "观山诀：10": 0
      }
    };
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '雷霆开山的释放时间减少1秒',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '雷霆开山的伤害增加40%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            staff: {
                gj: 1210,
                str: 102,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "雷霆开山",
            distime: 4000,
            enable_skill: "staff",
            mp: 1020,
            release_time: 7000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 雷霆开山
                // 使出全体气力劈向敌人，造成400%伤害，臂力加成越高伤害越高
                me.send_room("$N使出「雷霆开山」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使出全体气力劈向敌人，造成400%伤害，臂力加成越高伤害越高";
            },
        },
    };
}
