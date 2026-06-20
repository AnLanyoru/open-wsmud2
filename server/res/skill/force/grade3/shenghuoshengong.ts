import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "圣火神功";
    id = "shenghuoshengong";
    grade = 3;
    
    desc = "明教的内功心法";
    can_enables = ["force"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '内力上限：+122000',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '圣火护体额外增加15%效果',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 15,
                fy: lv * 1,
                limit_mp: lv * 100,
                desc: "唯一：将你内力的70%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "圣火护体",
            distime: 60000,
            enable_skill: "force",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 圣火护体
                // 增加自身防御，20秒内提升自身，攻击防御20%。
                me.send_room("$N使出「圣火护体」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "增加自身防御，20秒内提升自身，攻击防御20%。";
            },
        },
    };
}
