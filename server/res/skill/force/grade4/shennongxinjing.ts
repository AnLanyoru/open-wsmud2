import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "神农心经";
    id = "shennongxinjing";
    grade = 4;
    
    desc = "药王谷内功，传自神农尝百草之术，既能固本培元，亦能御毒抗邪。";
    can_enables = ["force"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '金针渡穴清理自身的全部异常状态',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '万法不侵期间增加伤害减免35%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 30,
                con: Math.floor(lv * 0.338),
                fy: Math.floor(lv * 1.95),
                recover_per: 10,
                limit_mp: lv * 198,
                desc: "唯一：将你内力的85%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "金针渡穴",
            distime: 15000,
            enable_skill: "force",
            mp: 60,
            release_time: 1500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 金针渡穴
                // 消耗内力以金针刺激穴位，为自己恢复13206点气血，清理1个异常状态。
                me.send_room("$N使出「金针渡穴」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "消耗内力以金针刺激穴位，为自己恢复13206点气血，清理1个异常状态。";
            },
        },
        pfm_1: {
            name: "万法不侵",
            distime: 60000,
            enable_skill: "force",
            mp: 150,
            release_time: 2000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 万法不侵
                // 以草木之姿融于天地，9秒内不会受到内力伤害，每2秒恢复6%气血。
                me.send_room("$N使出「万法不侵」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "以草木之姿融于天地，9秒内不会受到内力伤害，每2秒恢复6%气血。";
            },
        },
    };
}
