import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "镇岳诀";
    id = "zhenyuejue";
    grade = 3;
    
    desc = "衡山派的内功心法。";
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
            format: (val: number) => '镇岳额外增加166臂力',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '镇岳诀冷却时间减少25%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                fy: Math.floor(lv * 1.31),
                max_hp: 50 + lv * 10,
                fy_per: 6,
                limit_mp: lv * 103,
                desc: "唯一将你内力的77%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "镇岳",
            distime: 60000,
            enable_skill: "force",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 镇岳
                // 使用镇岳诀增加你333的臂力，持续30秒
                me.send_room("$N使出「镇岳」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使用镇岳诀增加你333的臂力，持续30秒";
            },
        },
    };
}
