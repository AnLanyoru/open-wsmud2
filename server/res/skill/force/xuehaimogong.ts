import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "血海魔功";
    id = "xuehaimogong";
    grade = 4;
    
    desc = "血刀门的内功心法。";
    can_enables = ["force"];
    learn_condition = {
      "str1": 30,
      "con1": 30
    };
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '内力上限：+140000',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '血祭时不消耗气血',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '血祭结束后将不会虚弱',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: 1612,
                fy: 1780,
                diff_fy_per: 6,
                limit_mp: 140000,
                desc: "唯一将你内力的75%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "血魔",
            distime: 60000,
            enable_skill: "force",
            mp: 2040,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 血魔
                // 血魔附体，增加你20%的攻击，防御，命中，躲闪，招架，持续30秒
                me.send_room("$N使出「血魔」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "血魔附体，增加你20%的攻击，防御，命中，躲闪，招架，持续30秒";
            },
        },
        pfm_1: {
            name: "血祭",
            distime: 60000,
            enable_skill: "force",
            mp: 2856,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 血祭
                // 血祭自身，消耗你25%的最大气血，在9秒内不会死亡不会被控制，效果结束后9秒内自身减少30%战斗属性。
                me.send_room("$N使出「血祭」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "血祭自身，消耗你25%的最大气血，在9秒内不会死亡不会被控制，效果结束后9秒内自身减少30%战斗属性。";
            },
        },
    };
}
