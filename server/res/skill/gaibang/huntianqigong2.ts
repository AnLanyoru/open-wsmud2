import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "混元天罡";
    id = "huntianqigong2";
    grade = 4;
    family = FAMILIES.GAIBANG;
    desc = "丐帮的高级心法";
    can_enables = ["force"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '内力上限：+120000',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '天罡的效果增加20%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: 20 + lv * 2,
                con: 4 + Math.floor(lv * 0.25),
                fy: 30 + lv * 2,
                limit_mp: lv * 158,
                desc: "唯一：将你内力的70%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "天罡",
            distime: 45000,
            enable_skill: "force",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 天罡
                // 15秒内提升自身攻击免伤20%。
                me.send_room("$N使出「天罡」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "15秒内提升自身攻击免伤20%。";
            },
        },
    };
}
