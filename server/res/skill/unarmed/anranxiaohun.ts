import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "黯然销魂掌";
    id = "anranxiaohun";
    grade = 5;
    
    desc = "神雕大侠杨过和小龙女分开后，因为刻骨思念之情而创出的一路掌法，黯然销魂者，唯别而已矣";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 2320,
                mz: 1720,
                int: 262,
                con: 262,
                diff_downside_per: 10,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "无中生有",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 1734,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 无中生有
                // 对敌人造成200%的伤害，命中后会偷取敌人的一个正面状态附加自身
                me.send_room("$N使出「无中生有」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成200%的伤害，命中后会偷取敌人的一个正面状态附加自身";
            },
        },
        pfm_1: {
            name: "呆若木鸡",
            distime: 36000,
            enable_skill: "unarmed",
            mp: 1020,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 呆若木鸡
                // 超高命中的一击，对敌人造成266%的伤害，命中减少对方60%攻击速度和技能释放速度
                me.send_room("$N使出「呆若木鸡」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "超高命中的一击，对敌人造成266%的伤害，命中减少对方60%攻击速度和技能释放速度";
            },
        },
    };
}
