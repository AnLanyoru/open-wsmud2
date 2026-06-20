import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "踏雪寻梅";
    id = "taxuexunmei2";
    source_skill = "taxuexunmei";
    grade = 5;
    family = FAMILIES.SHASHOU;
    desc = "踏雪寻梅是杀手楼一种特别厉害的上乘轻功，即使穿着铁鞋踩在雪上，也不会留下一点脚印。";
    can_enables = ["dodge"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: Math.floor(lv * 2.1),
                mz: Math.floor(lv * 1.71),
                dex: Math.floor(lv * 0.51),
                bj_per: 4,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "无痕",
            distime: 45000,
            enable_skill: "dodge",
            mp: 30,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 无痕
                // 8秒内免疫控制，并增加40%躲闪
                me.send_room("$N使出「无痕」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "8秒内免疫控制，并增加40%躲闪";
            },
        },
    };
}
