import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "凌波微步";
    id = "lingboweibu2";
    grade = 5;
    family = FAMILIES.XIAOYAO;
    desc = "无";
    can_enables = ["dodge"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: 2100,
                dex: 510,
                ds_per: 6,
            },
            // Global/base properties:
            // {"ds_per":8} 
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "凌波",
            distime: 40000,
            enable_skill: "dodge",
            mp: 1020,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 凌波
                // 全力施展凌波微步，在10秒(提升躲闪提高持续时间)内绝对躲闪敌方攻击。
                me.send_room("$N使出「凌波」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "全力施展凌波微步，在10秒(提升躲闪提高持续时间)内绝对躲闪敌方攻击。";
            },
        },
    };
}
