import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "小无相功";
    id = "xiaowuxianggong2";
    source_skill = "xiaowuxianggong";
    grade = 5;
    family = FAMILIES.XIAOYAO;
    desc = "逍遥派的一门奇特武功，其主要特点是不着形相，无迹可寻，可以模仿别人的绝学";
    can_enables = ["sword","unarmed","force"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                str: 5 + Math.floor(lv * 0.33),
                dex: 5 + Math.floor(lv * 0.33),
                con: 5 + Math.floor(lv * 0.33),
                limit_mp: lv * 300,
                desc: "唯一：将你内力的75%转化为气血",
            },
            unarmed: {
                str: 5 + Math.floor(lv * 0.33),
                dex: 5 + Math.floor(lv * 0.33),
                con: 5 + Math.floor(lv * 0.33),
            },
            sword: {
                str: 5 + Math.floor(lv * 0.33),
                dex: 5 + Math.floor(lv * 0.33),
                con: 5 + Math.floor(lv * 0.33),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "无相",
            distime: 60000,
            enable_skill: "sword",
            mp: 40,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 无相
                // 模仿敌人的上一个绝招，效果是你小无相功等级的85%，如果你的小无相品阶不低于对方技能的品阶并且是武器技能，你将学会这个绝招
                me.send_room("$N使出「无相」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "模仿敌人的上一个绝招，效果是你小无相功等级的85%，如果你的小无相品阶不低于对方技能的品阶并且是武器技能，你将学会这个绝招";
            },
        },
        pfm_1: {
            name: "无我",
            distime: 20000,
            enable_skill: "sword",
            mp: 40,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 无我
                // 使用你无相模仿并学会的绝招，效果是你小无相功等级的80%
                me.send_room("$N使出「无我」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使用你无相模仿并学会的绝招，效果是你小无相功等级的80%";
            },
        },
    };
}
