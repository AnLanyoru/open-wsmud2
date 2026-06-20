import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "金刚不坏体";
    id = "yijinjing2";
    grade = 5;
    family = FAMILIES.SHAOLIN;
    desc = "少林寺的高级内功心法，为少林寺镇寺之宝";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 20,
                fy: 5 + lv * 2,
                diff_bj: 3,
                fy_per: 8,
                limit_mp: lv * 285,
                desc: "唯一将你内力的90%转化为气血",
            },
            // Global/base properties:
            // {"diff_sh_per":8} 
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "佛光守护",
            distime: 30000,
            enable_skill: "force",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 佛光守护
                // 召唤佛光守护，增加你队友的伤害减免30%
                me.send_room("$N使出「佛光守护」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "召唤佛光守护，增加你队友的伤害减免30%";
            },
        },
        pfm_1: {
            name: "狮子吼",
            distime: 30000,
            enable_skill: "force",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 狮子吼
                // 深深地吸一囗气，真力迸发，发出一声惊天动地的巨吼，对附近敌人造成你最大内力15%(4252)的伤害，如果敌人当前内力小于你最大内力将昏迷7秒。
                me.send_room("$N使出「狮子吼」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "深深地吸一囗气，真力迸发，发出一声惊天动地的巨吼，对附近敌人造成你最大内力15%(4252)的伤害，如果敌人当前内力小于你最大内力将昏迷7秒。";
            },
        },
        pfm_2: {
            name: "金刚罩",
            distime: 45000,
            enable_skill: "force",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 金刚罩
                // 大幅减少你受到的伤害，10秒内增加60%伤害减免。
                me.send_room("$N使出「金刚罩」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "大幅减少你受到的伤害，10秒内增加60%伤害减免。";
            },
        },
    };
}
