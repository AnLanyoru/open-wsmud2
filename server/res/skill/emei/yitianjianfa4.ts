import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "诸天剑诀";
    id = "yitianjianfa4";
    grade = 6;
    family = FAMILIES.EMEI;
    is_ultimate = true;
    desc = "上古梵门绝技，灭神魔渡天下";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: lv * 3,
                mz: lv * 3,
                mz_per: 10,
                diff_fy_per: 10,
                add_bjsh_per: 13,
                desc: "超渡战斗中击杀敌人后恢复自己的全部血量，清理异常状态",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "渡魔",
            distime: 15000,
            enable_skill: "sword",
            mp: 1190,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 渡魔
                // 魔渡七重天，每层增加22%伤害和命中，超度敌人后重置绝招CD
                me.send_room("$N使出「渡魔」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "魔渡七重天，每层增加22%伤害和命中，超度敌人后重置绝招CD";
            },
        },
        pfm_1: {
            name: "渡佛",
            distime: 60000,
            enable_skill: "sword",
            mp: 1390,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 渡佛
                // 魔易渡，佛难超，清除敌人的正面状态，对敌人(NPC)造成伤害后唤出对方心魔替自己战斗，心魔具有敌人的大部分属性和技能，使用你35%的气血内力上限(每分钟可召唤一个，最多存在30秒)
                me.send_room("$N使出「渡佛」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "魔易渡，佛难超，清除敌人的正面状态，对敌人(NPC)造成伤害后唤出对方心魔替自己战斗，心魔具有敌人的大部分属性和技能，使用你35%的气血内力上限(每分钟可召唤一个，最多存在30秒)";
            },
        },
    };
}
