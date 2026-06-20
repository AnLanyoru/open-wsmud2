import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "明玉功";
    id = "mingyugong";
    grade = 4;
    
    desc = "移花宫的绝世武学，移花宫历代宫主修炼的最高内家正宗绝顶心法";
    can_enables = ["dodge","force"];
    learn_condition = {
      "dex1": 30,
      "int1": 30
    };
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '容貌：+3',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '太上忘情最大持续次数增加3',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '太上忘情启动后无法被清除',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                dazuo_per: 20,
                expend_mp_per: 10,
                per: 3,
                max_hp: lv * 10,
                limit_mp: lv * 150,
                desc: "唯一：将你内力的70%转化为气血",
            },
            dodge: {
                ds: Math.floor(lv * 1.5),
                dex: Math.floor(lv * 0.176),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "明玉",
            distime: 60000,
            enable_skill: "dodge",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 明玉
                // 使用明玉功提升战力，增加你20%的攻击，防御，命中，躲闪，招架，持续30秒
                me.send_room("$N使出「明玉」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使用明玉功提升战力，增加你20%的攻击，防御，命中，躲闪，招架，持续30秒";
            },
        },
        pfm_1: {
            name: "太上忘情",
            distime: 30000,
            enable_skill: "dodge",
            mp: 30,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 太上忘情
                // 明玉功之太上忘情，每2秒对敌人造成847伤害，持续20次，无法躲闪。
                me.send_room("$N使出「太上忘情」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "明玉功之太上忘情，每2秒对敌人造成847伤害，持续20次，无法躲闪。";
            },
        },
    };
}
