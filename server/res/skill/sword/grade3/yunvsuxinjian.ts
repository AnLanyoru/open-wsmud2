import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "玉女素心剑";
    id = "yunvsuxinjian";
    grade = 3;
    
    desc = "古墓派武学，玉女剑法与全真剑法合璧而成";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '双剑合璧附加的基础攻击力提高50%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '双剑合璧附加的基础命中提高50%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: Math.floor(lv * 1.51),
                mz: Math.floor(lv * 1.61),
                dex: Math.floor(lv * 0.176),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "双剑合璧",
            distime: 60000,
            enable_skill: "sword",
            mp: 100,
            release_time: 1000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 双剑合璧
                // 你手中的武器将提供双倍增幅效果，持续12秒。
                me.send_room("$N使出「双剑合璧」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "你手中的武器将提供双倍增幅效果，持续12秒。";
            },
        },
    };
}
