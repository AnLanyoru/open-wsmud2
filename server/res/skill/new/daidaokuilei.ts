import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "带刀傀儡";
    id = "daidaokuilei ";
    grade = 3;
    
    desc = "带刀傀儡";
    can_enables = [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            // Global/base properties:
            // {"gj":1000,"mz":1000,"fy":1000,"zj":1000,"ds":1000} 
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "护体",
            distime: 50000,
            enable_skill: "force",
            mp: 510,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 护体
                // 守护
                me.send_room("$N使出「护体」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "守护";
            },
        },
        pfm_1: {
            name: "铁壁冲撞",
            distime: 27000,
            enable_skill: "force",
            mp: 510,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 铁壁冲撞
                // 铁壁冲撞
                me.send_room("$N使出「铁壁冲撞」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "铁壁冲撞";
            },
        },
    };
}
