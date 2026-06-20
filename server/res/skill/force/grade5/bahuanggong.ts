import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "不老长春功";
    id = "bahuanggong";
    grade = 5;
    
    desc = "天长地久不老长春功，又名八荒六合唯我独尊，是灵鹫宫天山童姥的绝学。";
    can_enables = ["force"];
    learn_condition = {
      "con1": 40
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: Math.floor(lv * 20.1),
                hp_per: 8,
                con: Math.floor(lv * 0.338),
                diff_fy_per: 6,
                limit_mp: lv * 285,
                desc: "命中后对敌人造成附加伤害(年龄越大伤害越高)\n唯一：将你内力的95%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "不老长春",
            distime: 28000,
            enable_skill: "force",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 不老长春
                // 对附近敌人造成200%的伤害，并且吸收伤害转化为自身气血。
                me.send_room("$N使出「不老长春」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对附近敌人造成200%的伤害，并且吸收伤害转化为自身气血。";
            },
        },
        pfm_1: {
            name: "唯我独尊",
            distime: 40000,
            enable_skill: "force",
            mp: 40,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 唯我独尊
                // 震慑附近敌人，使对方难以释放技能，17秒内技能释放速度和冷却时间减慢3秒。
                me.send_room("$N使出「唯我独尊」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "震慑附近敌人，使对方难以释放技能，17秒内技能释放速度和冷却时间减慢3秒。";
            },
        },
    };
}
