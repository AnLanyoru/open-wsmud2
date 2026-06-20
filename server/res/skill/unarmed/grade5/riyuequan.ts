import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "日月拳法";
    id = "riyuequan";
    grade = 5;
    
    desc = "日月神教NPC使用的拳脚";
    can_enables = ["unarmed","parry"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 5 + lv * 2,
                mz: 10 + lv * 2,
                add_sh_per: 4,
                diff_fy_per: 4,
            },
            parry: {
                gj: 5 + lv * 2,
                mz: 10 + lv * 2,
                con: 5 + Math.floor(lv * 0.13),
                diff_sh_per: 4,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "击破",
            distime: 16000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 击破
                // 造成300%攻击力的伤害，等级越高命中越高。
                me.send_room("$N使出「击破」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "造成300%攻击力的伤害，等级越高命中越高。";
            },
        },
        pfm_1: {
            name: "日月连环",
            distime: 28000,
            enable_skill: "unarmed",
            mp: 25,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 日月连环
                // 三下都命中后使对方昏迷8秒。
                me.send_room("$N使出「日月连环」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "三下都命中后使对方昏迷8秒。";
            },
        },
    };
}
