import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "烛九阴";
    id = "zhujiuyin";
    grade = 6;
    
    desc = "烛九阴的功法";
    can_enables = [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            // Global/base properties:
            // {"gj":3000,"mz":3000,"fy":3000,"zj":3000,"ds":3000} 
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "烛龙之眼",
            distime: 28500,
            enable_skill: "force",
            mp: 33660,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 烛龙之眼
                // 闪瞎敌人
                me.send_room("$N使出「烛龙之眼」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "闪瞎敌人";
            },
        },
        pfm_1: {
            name: "爪击",
            distime: 28500,
            enable_skill: "force",
            mp: 17850,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 爪击
                // 闪瞎敌人
                me.send_room("$N使出「爪击」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "闪瞎敌人";
            },
        },
        pfm_2: {
            name: "怒吼",
            distime: 6650,
            enable_skill: "force",
            mp: 44880,
            release_time: 2000,
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
