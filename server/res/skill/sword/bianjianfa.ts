import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "彼岸剑法";
    id = "bianjianfa";
    grade = 4;
    
    desc = "慈航静斋的剑法";
    can_enables = ["sword","parry"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + lv * 2,
                mz: Math.floor(lv * 1.62),
                dex: Math.floor(lv * 0.127),
                mz_per: 8,
            },
            parry: {
                zj: Math.floor(lv * 2.31),
                mz_per: 4,
                dex: Math.floor(lv * 0.127),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "彼岸九式",
            distime: 35000,
            enable_skill: "sword",
            mp: 40,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 彼岸九式
                // 彼岸九式
                me.send_room("$N使出「彼岸九式」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "彼岸九式";
            },
        },
    };
}
