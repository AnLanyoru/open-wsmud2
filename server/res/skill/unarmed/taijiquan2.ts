import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "太极拳";
    id = "taijiquan2";
    grade = 4;
    family = FAMILIES.WUDANG;
    desc = "无";
    can_enables = ["unarmed","parry"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '震字决额外附加10%内力',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '震字决命中增加10%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 5 + lv * 2,
                mz: 5 + lv * 2,
                str: Math.floor(lv * 0.2),
                con: Math.floor(lv * 0.2),
            },
            parry: {
                zj: Math.floor(lv * 1.62),
                fy: 10 + lv * 2,
                max_hp: lv * 20,
                desc: "当你成功招架后会使敌人的攻击反向自身，无法躲闪",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "震字决",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 震字决
                // 以内力震伤敌人，造成你攻击力附加你最大内力20%(5670)的伤害。
                me.send_room("$N使出「震字决」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "以内力震伤敌人，造成你攻击力附加你最大内力20%(5670)的伤害。";
            },
        },
    };
}
