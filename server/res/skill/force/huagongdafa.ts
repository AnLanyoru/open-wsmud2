import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "化功大法";
    id = "huagongdafa";
    grade = 4;
    
    desc = "星宿派掌门丁春秋从北冥神功演化而来的内功，功法霸道专门化去别人内力。";
    can_enables = ["force"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '内力上限：+130000',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '吸取内力的冷却减少4秒',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '化毒的增益效果变为增加自身最终伤害和防御减免15%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                fy: 1510,
                gj: 1510,
                limit_mp: 155000,
                desc: "当你命中敌人后会吸取对方内力增加自身最大内力; 唯一将你内力的75%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "化毒",
            distime: 30000,
            enable_skill: "force",
            mp: 0,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 化毒
                // 在6秒内内力化毒布满自身，增加自身1500点攻击和防御，被敌人击中后会减少敌方10333点内力
                me.send_room("$N使出「化毒」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "在6秒内内力化毒布满自身，增加自身1500点攻击和防御，被敌人击中后会减少敌方10333点内力";
            },
        },
        pfm_1: {
            name: "化功",
            distime: 20000,
            enable_skill: "force",
            mp: 0,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 化功
                // 在10秒内内力化毒布满四周，使周围的敌人攻击和命中降低20%
                me.send_room("$N使出「化功」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "在10秒内内力化毒布满四周，使周围的敌人攻击和命中降低20%";
            },
        },
    };
}
