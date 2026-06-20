import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "火龙攻击";
    id = "huolong";
    grade = 4;
    
    desc = "火龙攻击方式，会中毒";
    can_enables = [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            // Global/base properties:
            // {"gj":2000,"mz":2000,"fy":2000,"zj":2000,"ds":1000} 
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "火毒攻击",
            distime: 60000,
            enable_skill: "force",
            mp: 510,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 火毒攻击
                // 每三秒减少气血
                me.send_room("$N使出「火毒攻击」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "每三秒减少气血";
            },
        },
        pfm_1: {
            name: "撕咬",
            distime: 7000,
            enable_skill: "force",
            mp: 510,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 撕咬
                // 快速攻击5次
                me.send_room("$N使出「撕咬」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "快速攻击5次";
            },
        },
        pfm_2: {
            name: "威慑",
            distime: 20000,
            enable_skill: "force",
            mp: 510,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 威慑
                // 威慑对方，2倍攻击的伤害并忙乱
                me.send_room("$N使出「威慑」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "威慑对方，2倍攻击的伤害并忙乱";
            },
        },
    };
}
