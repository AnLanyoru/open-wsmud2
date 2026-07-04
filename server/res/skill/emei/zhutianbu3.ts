import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "诸天化身步";
    id = "zhutianbu3";
    source_skill = "zhutianbu2";
    grade = 5;
    family = FAMILIES.EMEI;
    is_hidden = true;

    desc = "峨眉派轻功身法，如有千万化身。";
    can_enables = ["dodge"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '万佛化身开启后会清理自身异常状态',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '万佛化身额外增加10%负面抵抗',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: lv * 3,
                con: 2 + Math.floor(lv * 0.25),
                dex: 2 + Math.floor(lv * 0.25),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "万佛化身",
            distime: 28500,
            enable_skill: "dodge",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 万佛化身
                // 增加自己1000%的负面抵抗，持续10秒。
                me.send_room("$N使出「万佛化身」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "增加自己1000%的负面抵抗，持续10秒。";
            },
        },
    };
}
