import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "金刚不灭体";
    id = "yijinjing4";
    grade = 6;
    family = FAMILIES.SHAOLIN;
    desc = "上古佛门心法，金刚不灭万法皆空";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: 3000,
                fy: 3000,
                fy_per: 10,
                diff_sh_per: 10,
                diff_bj: 10,
                limit_mp: 990000,
                desc: "唯一将你内力的130%转化为气血; 金刚装备后将你12%防御力转化为固定免伤",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "不灭金身",
            distime: 60000,
            enable_skill: "force",
            mp: 72420,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 不灭金身
                // 召唤金身，免疫大部分伤害，反弹受到的伤害。
                me.send_room("$N使出「不灭金身」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "召唤金身，免疫大部分伤害，反弹受到的伤害。";
            },
        },
        pfm_1: {
            name: "万法皆空",
            distime: 50000,
            enable_skill: "force",
            mp: 117300,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 万法皆空
                // 佛法无边，冲击附近敌人，使对方的气血和内力都受到你25%最大内力的伤害。
                me.send_room("$N使出「万法皆空」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "佛法无边，冲击附近敌人，使对方的气血和内力都受到你25%最大内力的伤害。";
            },
        },
    };
}
