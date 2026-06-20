import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "一指禅";
    id = "yizhichan2";
    grade = 4;
    family = FAMILIES.SHAOLIN;
    desc = "少林寺七十二绝技之一指禅";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '惊魔一指的命中：+1000',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '惊魔一指附加的攻击力增加100%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 2020,
                str: 251,
                mz: 1603,
                mz_per: 10,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "惊魔一指",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 1020,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 惊魔一指
                // 一指禅之惊魔一指，运用无形剑气攻击敌人，使人无法招架，命中后昏迷7秒。
                me.send_room("$N使出「惊魔一指」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "一指禅之惊魔一指，运用无形剑气攻击敌人，使人无法招架，命中后昏迷7秒。";
            },
        },
    };
}
