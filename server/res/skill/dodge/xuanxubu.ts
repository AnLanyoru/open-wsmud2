import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "玄虚步";
    id = "xuanxubu";
    grade = 4;
    
    desc = "这是龙木二岛主在侠客岛的石室中领悟到一式轻功";
    can_enables = ["dodge"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '幻影的附加的躲闪和免伤额外增加8%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '玄虚步的反击伤害增加150%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: 2100,
                dex: 251,
                ds_per: 4,
                desc: "当你躲闪成后顺势反击敌人",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "幻影",
            distime: 45000,
            enable_skill: "dodge",
            mp: 1020,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 幻影
                // 8秒内提高你15%的躲闪，使用幻影迷惑敌人减少你受到的伤害15%。
                me.send_room("$N使出「幻影」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "8秒内提高你15%的躲闪，使用幻影迷惑敌人减少你受到的伤害15%。";
            },
        },
    };
}
