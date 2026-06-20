import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "惊鸿步";
    id = "jinghongbu";
    grade = 4;
    
    desc = "传说是已经消失的清音阁的轻功身法，其形如惊鸿，身如游龙";
    can_enables = ["dodge"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '掠影冷却时间减少5秒',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '掠影闪避攻击次数+2',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: 1525,
                gj: 608,
                con: 108,
                dex: 108,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "掠影",
            distime: 45000,
            enable_skill: "dodge",
            mp: 3060,
            release_time: 1000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 掠影
                // 闪避接下来的4次攻击。(优先级低于定身和无法躲闪的攻击)
                me.send_room("$N使出「掠影」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "闪避接下来的4次攻击。(优先级低于定身和无法躲闪的攻击)";
            },
        },
    };
}
