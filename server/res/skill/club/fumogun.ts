import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "伏魔棍";
    id = "fumogun";
    grade = 4;
    
    desc = "净念禅院的武器功法";
    can_enables = ["club"];
    attack_actions = SKILL.get("club")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            club: {
                gj: 2015,
                mz: 2015,
                fy: 2015,
                diff_sh_per: 3,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "金刚伏魔",
            distime: 20000,
            enable_skill: "club",
            mp: 1020,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 金刚伏魔
                // 金刚伏魔，造成320%攻击力的伤害，命中后震慑敌人使敌人忙乱6秒。
                me.send_room("$N使出「金刚伏魔」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "金刚伏魔，造成320%攻击力的伤害，命中后震慑敌人使敌人忙乱6秒。";
            },
        },
    };
}
