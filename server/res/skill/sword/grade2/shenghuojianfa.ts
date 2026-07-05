import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "圣火令法";
    id = "shenghuojianfa";
    grade = 2;
    
    desc = "明教的一门记载在圣火令上的剑法(未完善)";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: Math.floor(lv * 1.41),
                mz: Math.floor(lv * 1.42),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "圣火焚烧",
            distime: 20000,
            enable_skill: "sword",
            mp: 20,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 圣火焚烧
                // 对附近敌人每人攻击三次
                me.send_room("$N使出「圣火焚烧」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对附近敌人每人攻击三次";
            },
        },
    };
}
