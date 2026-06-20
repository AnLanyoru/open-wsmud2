import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "先天功";
    id = "xiantiangong";
    grade = 4;
    
    desc = "由重阳真人所创的一门道家绝妙武功，至刚至阳";
    can_enables = ["force"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '内力上限：+110000',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '定阳气会同步恢复内力',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '纯阳气期间对敌人造成40%防御力的反震伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: lv * 2,
                hp_per: 8,
                fy_per: 8,
                limit_mp: lv * 190,
                desc: "唯一：将你内力的82%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "纯阳气",
            distime: 30000,
            enable_skill: "force",
            mp: 45,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 纯阳气
                // 将你的纯阳真气附加于武器或拳脚之上，14秒内你的伤害都附加你最大内力1%的伤害。
                me.send_room("$N使出「纯阳气」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "将你的纯阳真气附加于武器或拳脚之上，14秒内你的伤害都附加你最大内力1%的伤害。";
            },
        },
        pfm_1: {
            name: "定阳气",
            distime: 50000,
            enable_skill: "force",
            mp: 22,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 定阳气
                // 使用纯阳内力治疗你的内伤，恢复你20%内力的气血。
                me.send_room("$N使出「定阳气」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使用纯阳内力治疗你的内伤，恢复你20%内力的气血。";
            },
        },
    };
}
