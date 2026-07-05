import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "真言手印";
    id = "zhenyanshouyin";
    grade = 5;
    
    desc = "九字真言手印含天地之秘，通过人体而与宇宙沟通，达致天人合一之境，明心见性，即身成佛。(未完善)";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.92),
                str: 4 + Math.floor(lv * 0.33),
                mz: 3 + Math.floor(lv * 1.8),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "九字真言",
            distime: 15000,
            enable_skill: "unarmed",
            mp: 50,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 九字真言
                // 真言伤人
                me.send_room("$N使出「九字真言」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "真言伤人";
            },
        },
        pfm_1: {
            name: "不死法印",
            distime: 60000,
            enable_skill: "unarmed",
            mp: 70,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 不死法印
                // 真言守护，将你的150%的攻击力转化为固额免伤，持续8秒
                me.send_room("$N使出「不死法印」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "真言守护，将你的150%的攻击力转化为固额免伤，持续8秒";
            },
        },
    };
}
