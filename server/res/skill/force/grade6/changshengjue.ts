import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "长生诀";
    id = "changshengjue";
    grade = 6;
    
    desc = "无";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                fy_per: 15,
                hp_per: 15,
                diff_sh_per: 10,
                limit_mp: lv * 1000,
                desc: "不灭：当你的气血降低到10%时候会恢复大量气血，并短时间无视伤害，冷却10分钟\n唯一：将你内力的150%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "天地决",
            distime: 60000,
            enable_skill: "force",
            mp: 3700,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 天地决
                // 沟通天地之力，恢复自身全部气血，清除负面状态，并重置所有技能冷却
                me.send_room("$N使出「天地决」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "沟通天地之力，恢复自身全部气血，清除负面状态，并重置所有技能冷却";
            },
        },
        pfm_1: {
            name: "混沌诀",
            distime: 60000,
            enable_skill: "force",
            mp: 2320,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 混沌诀
                // 13秒内，你单次受到的伤害不会超过你气血的13%，超过的伤害将转化为你的气血，内力
                me.send_room("$N使出「混沌诀」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "13秒内，你单次受到的伤害不会超过你气血的13%，超过的伤害将转化为你的气血，内力";
            },
        },
    };
}
