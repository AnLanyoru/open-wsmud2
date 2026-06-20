import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "神照经";
    id = "shenzhaojing";
    grade = 4;
    
    desc = "无";
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
            format: (val: number) => '额外增加210点悟性',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '拳经附加的额外气血增加30%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                str: 176,
                con: 176,
                dex: 176,
                int: 176,
                limit_mp: 150000,
                desc: "唯一将你内力的80%转化为气血",
            },
            unarmed: {
                gj: 1700,
                mz: 1700,
                str: 210,
                con: 210,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "神照",
            distime: 60000,
            enable_skill: "unarmed",
            mp: 1020,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 神照
                // 神照护体，在30秒内增加你210点根骨，臂力，身法
                me.send_room("$N使出「神照」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "神照护体，在30秒内增加你210点根骨，臂力，身法";
            },
        },
        pfm_1: {
            name: "拳经",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 1020,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 拳经
                // 一式直拳对敌人造成伤害，造成1%攻击力的伤害，你臂力越高造成的伤害越大，命中后给自己增加一个吸收1512伤害的护盾，护盾期间拳经冷却减少。
                me.send_room("$N使出「拳经」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "一式直拳对敌人造成伤害，造成1%攻击力的伤害，你臂力越高造成的伤害越大，命中后给自己增加一个吸收1512伤害的护盾，护盾期间拳经冷却减少。";
            },
        },
    };
}
