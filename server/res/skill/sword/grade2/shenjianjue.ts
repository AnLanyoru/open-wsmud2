import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "神剑诀";
    id = "shenjianjue";
    grade = 2;
    
    desc = "卓不凡在长白山得到剑谱,苦练二十年，自觉天下无敌,自称剑神(未完善)";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '剑芒额外增加8%暴击伤害',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '剑气造成的伤害增加43%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                mz: Math.floor(lv * 2.1),
                bj_per: 4,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "剑芒",
            distime: 30000,
            enable_skill: "sword",
            mp: 50,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 剑芒
                // 催动内力使你的剑锋芒毕露，8秒内增加8%的暴击率
                me.send_room("$N使出「剑芒」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "催动内力使你的剑锋芒毕露，8秒内增加8%的暴击率";
            },
        },
        pfm_1: {
            name: "剑气",
            distime: 20000,
            enable_skill: "sword",
            mp: 50,
            release_time: 3700,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 剑气
                // 以剑气从数里之外伤人，对敌人造成150%，如果暴击则冷却立刻完成
                me.send_room("$N使出「剑气」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "以剑气从数里之外伤人，对敌人造成150%，如果暴击则冷却立刻完成";
            },
        },
    };
}
