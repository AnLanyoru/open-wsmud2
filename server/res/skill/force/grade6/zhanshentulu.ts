import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "战神图录";
    id = "zhanshentulu";
    grade = 6;
    
    desc = "无";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                str: lv * 1,
                dex: lv * 1,
                con: lv * 1,
                int: lv * 1,
                limit_mp: lv * 1050,
                desc: "破碎：每次的攻击都附加最大内力1%的伤害，当你空手时附加的内力加倍，并吸收部分伤害\n唯一：将你内力的140%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "战神决",
            distime: 60000,
            enable_skill: "force",
            mp: 920,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 战神决
                // 战神附体，短时间内大幅增加你的战力，免疫控制
                me.send_room("$N使出「战神决」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "战神附体，短时间内大幅增加你的战力，免疫控制";
            },
        },
        pfm_1: {
            name: "湮灭",
            distime: 45000,
            enable_skill: "force",
            mp: 1270,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 湮灭
                // 一拳破天地，对敌人造成11%最大内力的伤害后重置对方的所有附加的持续状态，减少对方的伤害和破防
                me.send_room("$N使出「湮灭」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "一拳破天地，对敌人造成11%最大内力的伤害后重置对方的所有附加的持续状态，减少对方的伤害和破防";
            },
        },
        pfm_2: {
            name: "破碎九重天",
            distime: 60000,
            enable_skill: "force",
            mp: 0,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 破碎九重天
                // 消耗你25%的当前内力，对附近敌人造成同等伤害，并使他们昏迷7秒。
                me.send_room("$N使出「破碎九重天」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "消耗你25%的当前内力，对附近敌人造成同等伤害，并使他们昏迷7秒。";
            },
        },
    };
}
