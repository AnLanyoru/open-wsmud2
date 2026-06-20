import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "枯木神功";
    id = "kumushengong";
    grade = 4;
    
    desc = "天龙寺的高级内功心法";
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
            format: (val: number) => '枯木逢春使用后8秒内增加自己15%免伤',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '战斗中首次受到致命伤害时恢复40%气血，冷却10分钟',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 10,
                fy: lv * 2,
                con: 4 + Math.floor(lv * 0.25),
                limit_mp: lv * 180,
                desc: "唯一将你内力的90%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "枯木逢春",
            distime: 60000,
            enable_skill: "force",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 枯木逢春
                // 恢复你20%气血，移除你自身的负面状态
                me.send_room("$N使出「枯木逢春」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "恢复你20%气血，移除你自身的负面状态";
            },
        },
    };
}
