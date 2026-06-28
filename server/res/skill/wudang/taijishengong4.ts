import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "太极真义";
    id = "taijishengong4";
    grade = 6;
    family = FAMILIES.WUDANG;
    is_ultimate = true;
    desc = "上古道家传承，玄门正宗";
    can_enables = ["parry"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            parry: {
                max_hp: lv * 300,
                int: lv * 1,
                zj: lv * 2,
                fy_per: 10,
                zj_per: 10,
                desc: "无极：招架成功后，召唤三清之一使用你装备的技能攻击",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "阴阳无极",
            distime: 55000,
            enable_skill: "parry",
            mp: 780,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 阴阳无极
                // 使敌人手忙脚乱，延长敌人已释放武功的冷却时间，并降低对方攻速
                me.send_room("$N使出「阴阳无极」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使敌人手忙脚乱，延长敌人已释放武功的冷却时间，并降低对方攻速";
            },
        },
        pfm_1: {
            name: "大道无极",
            distime: 45000,
            enable_skill: "parry",
            mp: 2750,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 大道无极
                // 大道无极，水利万物而不争，将气血内力重置，并移除异常状态
                me.send_room("$N使出「大道无极」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "大道无极，水利万物而不争，将气血内力重置，并移除异常状态";
            },
        },
    };
}
