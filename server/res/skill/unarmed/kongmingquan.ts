import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "空明拳";
    id = "kongmingquan";
    grade = 4;
    
    desc = "周伯通在桃花岛自创的一套拳法";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    learn_condition = {
      "int1": 40
    };
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '左右互搏使用的绝招会继承冷却时间',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '左右互搏使用的绝招会继承技能等级',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 1720,
                str: 167,
                mz: 1720,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "乱拳",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 1020,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 乱拳
                // 瞬间对敌人攻击6拳，如果全部命中，最后一拳无视对方30%防御
                me.send_room("$N使出「乱拳」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "瞬间对敌人攻击6拳，如果全部命中，最后一拳无视对方30%防御";
            },
        },
        pfm_1: {
            name: "左右互搏",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 1020,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 左右互搏
                // 再次使用你之前使用的绝招攻击敌人，效果是自身等级的75%。
                me.send_room("$N使出「左右互搏」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "再次使用你之前使用的绝招攻击敌人，效果是自身等级的75%。";
            },
        },
    };
}
