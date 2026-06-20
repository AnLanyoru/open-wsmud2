import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "天罡正气";
    id = "tiangangzhengqi";
    grade = 4;
    family = FAMILIES.LIUSHAN;
    desc = "六扇门镇派内功，凝聚天地正气，可震慑邪祟，爆发时刚猛无俦。";
    can_enables = ["force"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '正气诀额外增加40%命中',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '正气诀降低对方治疗效果的增加5%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: 15800,
                fy: 2150,
                limit_mp: 160000,
                desc: "唯一将你内力的90%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "正气诀",
            distime: 45000,
            enable_skill: "force",
            mp: 2550,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 正气诀
                // 爆发全身天罡正气在8秒内提升40%攻击，对附近敌人造成压制降低50%疗伤效果。
                me.send_room("$N使出「正气诀」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "爆发全身天罡正气在8秒内提升40%攻击，对附近敌人造成压制降低50%疗伤效果。";
            },
        },
    };
}
