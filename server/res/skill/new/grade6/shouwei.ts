import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "神殿守卫";
    id = "shouwei";
    grade = 6;
    
    desc = "神殿守卫(未完善)";
    can_enables = [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            // Global/base properties:
            // {"gj":3000,"mz":3000,"fy":3000,"zj":3000,"ds":3000} 
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "护体",
            distime: 40000,
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
            name: "旋转",
            distime: 27000,
            enable_skill: "force",
            mp: 510,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 旋转
                // 旋转攻击
                me.send_room("$N使出「旋转」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "旋转攻击";
            },
        },
    };
}
