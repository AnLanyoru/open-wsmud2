import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "九阴神功";
    id = "jiuyinshengong";
    grade = 5;
    
    desc = "一种至阴至寒的绝世神功，使用得当会大幅激发你的潜能";
    can_enables = ["force"];
    learn_condition = {
      "str1": 35,
      "dex1": 35
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 20,
                mz: Math.floor(lv * 2.2),
                diff_fy_per: 6,
                limit_mp: lv * 285,
                desc: "命中后会使敌人减少攻击，躲闪，命中1%\n唯一：将你内力的90%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "追魂",
            distime: 15000,
            enable_skill: "force",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 追魂
                // 引爆敌人身上的九阴劲气，每层造成${ me.gj*（0.1 + Math.floor(lv/50)*0.01）}的真实伤害，层数大于5层将使敌方昏迷6秒。
                me.send_room("$N使出「追魂」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "引爆敌人身上的九阴劲气，每层造成169.4的真实伤害，层数大于5层将使敌方昏迷6秒。";
            },
        },
        pfm_1: {
            name: "逆转九阴",
            distime: 60000,
            enable_skill: "force",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 逆转九阴
                // 逆转九阴，全力攻击，11秒内增加你60%的攻击，40%的无视防御，20%的攻击速度，减少你80%的防御和伤害减免
                me.send_room("$N使出「逆转九阴」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "逆转九阴，全力攻击，11秒内增加你60%的攻击，40%的无视防御，20%的攻击速度，减少你80%的防御和伤害减免";
            },
        },
    };
}
