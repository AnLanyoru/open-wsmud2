import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "太阳烛照";
    id = "zhuzhao";
    grade = 6;
    
    desc = "太阳烛照的功法";
    can_enables = [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            // Global/base properties:
            // {"gj":3000,"mz":3000,"fy":3000,"zj":3000,"ds":3000} 
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "烈焰",
            distime: 30000,
            enable_skill: "force",
            mp: 34170,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 烈焰
                // 灼烧敌人
                me.send_room("$N使出「烈焰」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "灼烧敌人";
            },
        },
        pfm_1: {
            name: "怒吼",
            distime: 7000,
            enable_skill: "force",
            mp: 44880,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 怒吼
                // 吸气攻击
                me.send_room("$N使出「怒吼」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "吸气攻击";
            },
        },
    };
}
