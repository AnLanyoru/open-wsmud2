import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "无念禅功";
    id = "wunianchangong";
    grade = 5;
    
    desc = "净念禅宗的内功心法";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 30,
                fy: 5 + lv * 3,
                hp_per: 13,
                fy_per: 13,
                diff_sh_per: 8,
                limit_mp: lv * 250,
                desc: "唯一将你内力的100%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "净念",
            distime: 30000,
            enable_skill: "force",
            mp: 50,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 净念
                // 清除你的负面状态和敌人的正面状态
                me.send_room("$N使出「净念」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "清除你的负面状态和敌人的正面状态";
            },
        },
        pfm_1: {
            name: "无念",
            distime: 30000,
            enable_skill: "force",
            mp: 40,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 无念
                // 减少你受到的伤害，10秒内增加33%伤害减免，每次附加攻击附加你内力的1%伤害。
                me.send_room("$N使出「无念」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "减少你受到的伤害，10秒内增加33%伤害减免，每次附加攻击附加你内力的1%伤害。";
            },
        },
        pfm_2: {
            name: "闭口禅",
            distime: 50000,
            enable_skill: "force",
            mp: 80,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 闭口禅
                // 造成15%内力伤害，12秒内禁止对方下个绝招。
                me.send_room("$N使出「闭口禅」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "造成15%内力伤害，12秒内禁止对方下个绝招。";
            },
        },
    };
}
