import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "吸星大法";
    id = "xixingdafa";
    grade = 4;
    
    desc = "源自魔教的一种诡异功法，可化去他人内力，也能吸内力化为己用。";
    can_enables = ["force"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '内力上限：+125000',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '吸字诀持续次数增加3次',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '吸字诀每次造成的伤害增加20%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 30,
                hp_per: 4,
                fy_per: 4,
                limit_mp: lv * 155,
                desc: "唯一将你内力的90%转化为气血; 命中后会化掉对方4000当前内力",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "吸字诀",
            distime: 30000,
            enable_skill: "force",
            mp: 0,
            release_time: 5600,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 吸字诀
                // 命中后使敌人无法行动，每次对敌人造成110%攻击力的气血和内力伤害，吸收对方受到的伤害转为自身气血，持续5次
                me.send_room("$N使出「吸字诀」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "命中后使敌人无法行动，每次对敌人造成110%攻击力的气血和内力伤害，吸收对方受到的伤害转为自身气血，持续5次";
            },
        },
    };
}
