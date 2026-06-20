import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "魔剑";
    id = "mojian";
    grade = 6;
    
    desc = "剑魔独孤求败以剑入魔后使用的剑法";
    can_enables = ["sword","parry"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 2010,
                mz: 2020,
                str: 335,
                add_sh_per: 8,
            },
            parry: {
                zj: 2010,
                fy: 2310,
                fy_per: 13,
                max_hp: 20000,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "疯魔",
            distime: 28500,
            enable_skill: "sword",
            mp: 0,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 疯魔
                // 10秒内攻速翻倍，每次攻击附加并消耗你当前内力的4%，暴击后吸取伤害恢复自身
                me.send_room("$N使出「疯魔」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "10秒内攻速翻倍，每次攻击附加并消耗你当前内力的4%，暴击后吸取伤害恢复自身";
            },
        },
        pfm_1: {
            name: "附魔",
            distime: 19000,
            enable_skill: "sword",
            mp: 2040,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 附魔
                // 打残敌人，命中后使敌方处于残缺状态，降低战斗属性30%
                me.send_room("$N使出「附魔」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "打残敌人，命中后使敌方处于残缺状态，降低战斗属性30%";
            },
        },
    };
}
