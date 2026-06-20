import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "御剑术";
    id = "yujianshu ";
    grade = 5;
    
    desc = "蜀山立派之本，以气驭剑，人剑合一";
    can_enables = ["sword","parry"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 5 + Math.floor(lv * 2.21),
                mz: 15 + lv * 2,
                bj_per: 5,
                add_bjsh_per: 12,
                desc: "命中敌人后积累一道剑气",
            },
            parry: {
                zj: 2 + Math.floor(lv * 2.11),
                fy: Math.floor(lv * 1.1),
                diff_bj: 5,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "万剑诀",
            distime: 18000,
            enable_skill: "sword",
            mp: 45,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 万剑诀
                // 召唤最多4道剑气攻击当前敌人，剩余剑气每道增加2%的伤害和命中。
                me.send_room("$N使出「万剑诀」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "召唤最多4道剑气攻击当前敌人，剩余剑气每道增加2%的伤害和命中。";
            },
        },
        pfm_1: {
            name: "天剑诀",
            distime: 25000,
            enable_skill: "sword",
            mp: 30,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 天剑诀
                // 人剑合一，对敌人造成300%攻击力的伤害，每道剑气增加1.3%暴击和暴击伤害
                me.send_room("$N使出「天剑诀」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "人剑合一，对敌人造成300%攻击力的伤害，每道剑气增加1.3%暴击和暴击伤害";
            },
        },
    };
}
