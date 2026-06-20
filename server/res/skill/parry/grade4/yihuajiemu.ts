import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "移花接木";
    id = "yihuajiemu";
    grade = 4;
    
    desc = "无";
    can_enables = ["parry"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '移花期间未能阻止对方绝招时冷却将立即结束',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            parry: {
                zj: Math.floor(lv * 1.72),
                fy: Math.floor(lv * 1.52),
                dex: 5 + Math.floor(lv * 0.25),
                con: 5 + Math.floor(lv * 0.25),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "移花",
            distime: 25000,
            enable_skill: "parry",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 移花
                // 以真气牵制敌人，8秒内降低敌人33%躲闪和招架，并能抵挡敌人的下一个绝招。
                me.send_room("$N使出「移花」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "以真气牵制敌人，8秒内降低敌人33%躲闪和招架，并能抵挡敌人的下一个绝招。";
            },
        },
    };
}
