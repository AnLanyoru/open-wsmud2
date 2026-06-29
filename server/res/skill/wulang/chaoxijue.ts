import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "潮汐诀";
    id = "chaoxijue";
    grade = 3;
    family = FAMILIES.WULANG;
    desc = "无浪门镇派内功，以潮汐起落为纲，融阴阳二气为用，可聚浪劲于内，化潮汐于外。";
    can_enables = ["force"];
    slots = [
        {
            prop: 'cxj_gm',
            value: (lv: number) => Math.floor(lv/5),
            format: (val: number) => `潮起时每层潮汐额外增加${val}点攻击和命中`,
        },
        {
            prop: 'cxj_fq',
            value: (lv: number) => Math.floor(lv/5),
            format: (val: number) => `潮落期间每层潮汐额外增加${val}防御和${val*5}气血`,
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: Math.floor(lv * 1.22),
                fy: Math.floor(lv * 1.22),
                limit_mp: lv * 105,
                desc: "潮汐：命中后增加自身潮汐层数\n唯一：将你内力的85%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "潮起",
            distime: 25000,
            enable_skill: "force",
            mp: 25,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 潮起
                // 消耗所有潮汐层数，20秒内每一层潮汐提升210攻击与命中
                me.send_room("$N使出「潮起」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "消耗所有潮汐层数，20秒内每一层潮汐提升210攻击与命中";
            },
        },
        pfm_1: {
            name: "潮落",
            distime: 25000,
            enable_skill: "force",
            mp: 25,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 潮落
                // 消耗所有潮汐层数，20秒内每一层潮汐提升1000防御与气血
                me.send_room("$N使出「潮落」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "消耗所有潮汐层数，20秒内每一层潮汐提升1000防御与气血";
            },
        },
    };
}
