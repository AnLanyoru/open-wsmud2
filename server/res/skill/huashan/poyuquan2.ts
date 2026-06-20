import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "劈石破玉拳";
    id = "poyuquan2";
    grade = 4;
    family = FAMILIES.HUASHAN;
    desc = "华山派拳脚功夫，原为劈石及破玉两路拳法绝学";
    can_enables = ["unarmed","parry"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '破玉附加的命中增加10%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '破玉附加的攻击力增加60%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.52),
                mz: Math.floor(lv * 1.51),
                str: Math.floor(lv * 0.25),
                dex: Math.floor(lv * 0.25),
            },
            parry: {
                zj: Math.floor(lv * 1.52),
                fy: Math.floor(lv * 1.51),
                con: Math.floor(lv * 0.25),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "破玉",
            distime: 16000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 破玉
                // 凝聚真气奋力一击，造成200%攻击力(紫霞神功)的伤害，等级越高命中越高。
                me.send_room("$N使出「破玉」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "凝聚真气奋力一击，造成200%攻击力(紫霞神功)的伤害，等级越高命中越高。";
            },
        },
        pfm_1: {
            name: "劈石",
            distime: 38000,
            enable_skill: "unarmed",
            mp: 25,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 劈石
                // 劈石一击，命中后可降低目标15%防御和命中，持续7秒。
                me.send_room("$N使出「劈石」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "劈石一击，命中后可降低目标15%防御和命中，持续7秒。";
            },
        },
    };
}
