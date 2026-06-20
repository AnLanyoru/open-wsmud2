import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "打狗棒";
    id = "dagoubang2";
    grade = 4;
    family = FAMILIES.GAIBANG;
    desc = "丐帮的打狗棒法";
    can_enables = ["club"];
    attack_actions = SKILL.get("club")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            club: {
                gj: 2100,
                mz: 2000,
                con: 200,
                str: 200,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "绊字决",
            distime: 20000,
            enable_skill: "club",
            mp: 1020,
            release_time: 1800,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 绊字决
                // 攻击敌方下路，命中后使对方忙乱8秒，并减低躲闪20%。
                me.send_room("$N使出「绊字决」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "攻击敌方下路，命中后使对方忙乱8秒，并减低躲闪20%。";
            },
        },
        pfm_1: {
            name: "天下无狗",
            distime: 20000,
            enable_skill: "club",
            mp: 1020,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 天下无狗
                // 快速对敌人攻击6次，每命中一次减少天下无狗的冷却时间１秒
                me.send_room("$N使出「天下无狗」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "快速对敌人攻击6次，每命中一次减少天下无狗的冷却时间１秒";
            },
        },
    };
}
