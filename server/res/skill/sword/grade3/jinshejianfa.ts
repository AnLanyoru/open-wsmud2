import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "金蛇剑法";
    id = "jinshejianfa";
    grade = 3;
    
    desc = "金蛇郎君所创的一门剑法(未完善)";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '金蛇狂舞的命中增加20%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '金蛇追魂无视对方20%防御',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: Math.floor(lv * 1.31),
                bj_per: 6,
                mz: Math.floor(lv * 1.31),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "金蛇狂舞",
            distime: 20000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 金蛇狂舞
                // 对敌人造成200%攻击力的伤害，命中后使敌人忙乱6秒
                me.send_room("$N使出「金蛇狂舞」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成200%攻击力的伤害，命中后使敌人忙乱6秒";
            },
        },
        pfm_1: {
            name: "金蛇追魂",
            distime: 30000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 金蛇追魂
                // 对敌人造成伤害，命中后使敌人昏迷4秒
                me.send_room("$N使出「金蛇追魂」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成伤害，命中后使敌人昏迷4秒";
            },
        },
    };
}
