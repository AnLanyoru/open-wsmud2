import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "如来神掌";
    id = "rulaishenzhang";
    grade = 5;
    
    desc = "无";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 1605,
                mz: 1805,
                mz_per: 8,
                gj_per: 8,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "万佛朝宗",
            distime: 25000,
            enable_skill: "unarmed",
            mp: 6120,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 万佛朝宗
                // 对附近敌人造成内力伤害，将造成的伤害转化为你的气血
                me.send_room("$N使出「万佛朝宗」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对附近敌人造成内力伤害，将造成的伤害转化为你的气血";
            },
        },
        pfm_1: {
            name: "灭魔",
            distime: 48000,
            enable_skill: "unarmed",
            mp: 6120,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 灭魔
                // 一式从天而降的掌法，对敌人造成大量伤害，并昏迷，防御,伤害减免会最终伤害和命中
                me.send_room("$N使出「灭魔」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "一式从天而降的掌法，对敌人造成大量伤害，并昏迷，防御,伤害减免会最终伤害和命中";
            },
        },
    };
}
