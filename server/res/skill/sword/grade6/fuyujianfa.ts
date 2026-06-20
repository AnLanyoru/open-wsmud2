import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "覆雨剑法";
    id = "fuyujianfa";
    grade = 6;
    
    desc = "浪翻云依据洞庭湖水性而自创的剑法，如行云流水，惊涛骇浪";
    can_enables = ["sword","parry"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + lv * 3,
                mz: 20 + lv * 3,
                dex: 2 + Math.floor(lv * 0.5),
                mz_per: 8,
                gjsd_per: 10,
            },
            parry: {
                zj: Math.floor(lv * 2.31),
                diff_sh_per: 4,
                zj_per: 8,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "剑雨",
            distime: 28500,
            enable_skill: "sword",
            mp: 1900,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 剑雨
                // 化剑为雨，攻击变为多次，增加穿透防御的几率
                me.send_room("$N使出「剑雨」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "化剑为雨，攻击变为多次，增加穿透防御的几率";
            },
        },
        pfm_1: {
            name: "剑罡",
            distime: 19000,
            enable_skill: "sword",
            mp: 1140,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 剑罡
                // 极致的剑法，大幅度增加命中和伤害，必定触发穿透
                me.send_room("$N使出「剑罡」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "极致的剑法，大幅度增加命中和伤害，必定触发穿透";
            },
        },
    };
}
