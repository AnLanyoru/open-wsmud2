import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "降龙掌";
    id = "xianglongzhang4";
    grade = 6;
    family = FAMILIES.GAIBANG;
    desc = "上古墨门以此功法义行天下，战神不败";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: lv * 3,
                mz: lv * 3,
                str: lv * 1,
                con: lv * 1,
                gj_per: 10,
                desc: "摧毁命中敌人后逐步瓦解敌方防御",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "降龙",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 1450,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 降龙
                // 命中后使敌人短时间内的无法移动，无法防御，如果摧毁级别大于3则昏迷
                me.send_room("$N使出「降龙」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "命中后使敌人短时间内的无法移动，无法防御，如果摧毁级别大于3则昏迷";
            },
        },
        pfm_1: {
            name: "破灭",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 2300,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 破灭
                // 耗费大量内力将数十式掌法合为一式瞬间打出，对敌人造成大量伤害，并降低对方的气血上限，如果摧毁级别大于3则完全瓦解对方防御
                me.send_room("$N使出「破灭」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "耗费大量内力将数十式掌法合为一式瞬间打出，对敌人造成大量伤害，并降低对方的气血上限，如果摧毁级别大于3则完全瓦解对方防御";
            },
        },
    };
}
