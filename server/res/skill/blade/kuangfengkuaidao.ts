import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "狂风快刀";
    id = "kuangfengkuaidao";
    grade = 3;
    
    desc = "采花大盗田伯光的成名刀法";
    can_enables = ["blade"];
    attack_actions = SKILL.get("blade")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '狂风二十一式期间命中增加12%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '狂风二十一式期间攻击力增加12%',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '狂风二十一式期间忽视对方防御10%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            blade: {
                gj: Math.floor(lv * 1.51),
                bj_per: 4,
                dex: Math.floor(lv * 0.2),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "狂风二十一式",
            distime: 30000,
            enable_skill: "blade",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 狂风二十一式
                // 快速攻击敌方21招，攻击期间增加你100%的攻速
                me.send_room("$N使出「狂风二十一式」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "快速攻击敌方21招，攻击期间增加你100%的攻速";
            },
        },
    };
}
