import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "弹指神通";
    id = "tanzhishengong";
    grade = 4;
    
    desc = "桃花岛的绝技，弹指神通";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '点穴将附加13%内力伤害，并减少对方内力',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '敌人的内力每降低1%弹指神通造成的伤害增加2%',
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
            name: "弹指惊雷",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 弹指惊雷
                // 对敌人造成200%攻击力的伤害，命中后减少对方15%的内力
                me.send_room("$N使出「弹指惊雷」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成200%攻击力的伤害，命中后减少对方15%的内力";
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
                // 弹指神通之点穴大法，命中后造成伤害，并使敌人忙乱10秒。
                me.send_room("$N使出「点穴」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "弹指神通之点穴大法，命中后造成伤害，并使敌人忙乱10秒。";
            },
        },
    };
}
