import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "逐浪步";
    id = "zhulangbu";
    grade = 2;
    family = FAMILIES.WULANG;
    desc = "无浪门独门轻功，以观潮汐、仿浪态而成，步法如海浪起伏无定";
    can_enables = ["dodge"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: Math.floor(lv * 1.3),
                dex: Math.floor(lv * 0.11),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "弄潮",
            distime: 35000,
            enable_skill: "dodge",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 弄潮
                // 在潮汐诀起效期间，20秒内附加每层收益：潮起期间增加自身210命中，潮落期间增加自身210躲闪。
                me.send_room("$N使出「弄潮」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "在潮汐诀起效期间，20秒内附加每层收益：潮起期间增加自身210命中，潮落期间增加自身210躲闪。";
            },
        },
    };
}
