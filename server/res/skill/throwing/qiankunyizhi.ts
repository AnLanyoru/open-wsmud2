import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "乾坤一掷";
    id = "qiankunyizhi  ";
    grade = 5;
    
    desc = "消耗自身金钱催动真气，金钱越多伤害越高。";
    can_enables = ["throwing"];
    attack_actions = SKILL.get("throwing")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            throwing: {
                gj: 2510,
                mz: 2008,
                str: 258,
                int: 258,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "乾坤一掷",
            distime: 20000,
            enable_skill: "throwing",
            mp: 1479,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 乾坤一掷
                // 消耗内力或自身金钱，化作暗器攻击敌人，造成基础为150%攻击力的伤害，附加金钱会增加大量伤害。
                me.send_room("$N使出「乾坤一掷」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "消耗内力或自身金钱，化作暗器攻击敌人，造成基础为150%攻击力的伤害，附加金钱会增加大量伤害。";
            },
        },
    };
}
