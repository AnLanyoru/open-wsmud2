import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "逍遥游";
    id = "xiaoyaoyou2";
    source_skill = "xiaoyaoyou";
    grade = 4;
    family = FAMILIES.GAIBANG;
    desc = "无";
    can_enables = ["dodge"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '仙游额外增加10%防御力',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '仙游额外增加10%攻击力',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: Math.floor(lv * 1.83),
                mz: Math.floor(lv * 1.63),
                str: 3 + Math.floor(lv * 0.25),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "仙游",
            distime: 30000,
            enable_skill: "dodge",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 仙游
                // 20秒内增加你30%命中。
                me.send_room("$N使出「仙游」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "20秒内增加你30%命中。";
            },
        },
    };
}
