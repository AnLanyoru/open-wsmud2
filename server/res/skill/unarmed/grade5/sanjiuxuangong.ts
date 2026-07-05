import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "三九玄功";
    id = "sanjiuxuangong ";
    grade = 5;
    
    desc = "玄门正宗内功，融炼气、护体、降妖于一体，真气护体可御万邪。(未完善)";
    can_enables = ["unarmed","force"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                fy: Math.floor(lv * 3.32),
                fy_per: 12,
                diff_sh_per: 7,
                hp_per: 10,
                limit_mp: lv * 300,
                desc: "进入战斗后减少55%伤害，被命中后降低\n唯一：将你内力的95%转化为气血",
            },
            unarmed: {
                gj: Math.floor(lv * 3.32),
                mz: Math.floor(lv * 2.32),
                gj_per: 9,
                mz_per: 8,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "仙体术",
            distime: 55000,
            enable_skill: "unarmed",
            mp: 25,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 仙体术
                // 传闻出自仙人体术，6秒内进入仙体状态，获得35%伤害减免，免疫负面状态
                me.send_room("$N使出「仙体术」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "传闻出自仙人体术，6秒内进入仙体状态，获得35%伤害减免，免疫负面状态";
            },
        },
        pfm_1: {
            name: "酒神咒",
            distime: 28000,
            enable_skill: "unarmed",
            mp: 0,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 酒神咒
                // 消耗自身25%当前气血，对附近敌人造成自身免伤增幅的的直接伤害，当敌人气血少于15%将昏迷6秒。
                me.send_room("$N使出「酒神咒」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "消耗自身25%当前气血，对附近敌人造成自身免伤增幅的的直接伤害，当敌人气血少于15%将昏迷6秒。";
            },
        },
    };
}
