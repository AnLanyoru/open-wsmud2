import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "圆月弯刀";
    id = "yuanyuewandao";
    grade = 4;
    
    desc = "「魔教」的一项神奇、精妙的刀法，刀法虽然能带给人无穷的力量，却也能带给人不祥和灾祸";
    can_enables = ["blade"];
    attack_actions = SKILL.get("blade")?.attack_actions || [];
    learn_condition = {
      "dex1": 40
    };
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '入魔在内力耗尽后不会昏迷或虚弱',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '入魔和普攻的内力消耗降低60%',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '魔刀会附加150%攻击力的伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            blade: {
                gj: 10 + lv * 2,
                mz: 20 + lv * 2,
                gjsd_per: 10,
                add_sh_per: 8,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "入魔",
            distime: 60000,
            enable_skill: "blade",
            mp: 140,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 入魔
                // 4秒内入魔，由人驱刀变为刀驱人，附加的内力和命中增加20%，内力耗尽后会昏迷3秒
                me.send_room("$N使出「入魔」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "4秒内入魔，由人驱刀变为刀驱人，附加的内力和命中增加20%，内力耗尽后会昏迷3秒";
            },
        },
        pfm_1: {
            name: "魔刀",
            distime: 30000,
            enable_skill: "blade",
            mp: 0,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 魔刀
                // 耗尽全身内力驱使魔刀斩向附近敌人，造成同等伤害
                // 内力耗尽后不会虚弱，吸收部分伤害化为自身内力，此招不会暴击
                me.send_room("$N使出「魔刀」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "耗尽全身内力驱使魔刀斩向附近敌人，造成同等伤害，内力耗尽后不会虚弱，吸收伤害化为自身内力，此招不会暴击";
            },
        },
    };
}
