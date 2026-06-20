import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "金蛇游身步";
    id = "jinsheyoushenbu";
    grade = 3;
    
    desc = "无";
    can_enables = ["dodge"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '你的身法会增加金蛇游身成功率',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '金蛇游身成功后对方的忙乱时间+1秒',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: 1630,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "金蛇游身",
            distime: 30000,
            enable_skill: "dodge",
            mp: 1020,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 金蛇游身
                // 金蛇游身，如有万蛇缠身，成功后使敌人忙乱6秒。
                me.send_room("$N使出「金蛇游身」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "金蛇游身，如有万蛇缠身，成功后使敌人忙乱6秒。";
            },
        },
    };
}
