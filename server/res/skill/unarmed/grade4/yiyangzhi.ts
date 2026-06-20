import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "一阳指";
    id = "yiyangzhi";
    grade = 4;
    
    desc = "大理段家的绝技一阳指";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '一指乾坤的伤害额外增加60%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '点穴将使敌人昏迷最多10秒',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.82),
                str: 1 + Math.floor(lv * 0.2),
                mz: lv * 1,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "一指乾坤",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 一指乾坤
                // 对敌人造成150%攻击力的伤害，无法防御
                me.send_room("$N使出「一指乾坤」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成150%攻击力的伤害，无法防御";
            },
        },
        pfm_1: {
            name: "点穴",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 点穴
                // 一阳指之点穴大法，命中后造成伤害，并使敌人忙乱10秒。
                me.send_room("$N使出「点穴」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "一阳指之点穴大法，命中后造成伤害，并使敌人忙乱10秒。";
            },
        },
    };
}
