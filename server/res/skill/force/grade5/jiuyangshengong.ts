import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "九阳神功";
    id = "jiuyangshengong";
    grade = 5;
    
    desc = "出自少林的一部神秘经书内的内功心法。";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                fy: Math.floor(lv * 3.1),
                fy_per: 15,
                diff_sh_per: 6,
                hp_per: 6,
                limit_mp: lv * 290,
                desc: "当被命中后对敌人造成5333点反震伤害; 唯一将你内力的100%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "九阳护体",
            distime: 60000,
            enable_skill: "force",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 九阳护体
                // 将九阳真气布满全身，10秒内增加你60%的伤害减免，反震伤害加倍。
                me.send_room("$N使出「九阳护体」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "将九阳真气布满全身，10秒内增加你60%的伤害减免，反震伤害加倍。";
            },
        },
        pfm_1: {
            name: "九阳真焰",
            distime: 40000,
            enable_skill: "force",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 九阳真焰
                // 对敌人造成伤害，命中后12秒内受到你当前气血6%的内功伤害
                me.send_room("$N使出「九阳真焰」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成伤害，命中后12秒内受到你当前气血6%的内功伤害";
            },
        },
    };
}
