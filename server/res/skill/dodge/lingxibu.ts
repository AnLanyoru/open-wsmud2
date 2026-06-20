import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "灵犀步";
    id = "lingxibu";
    grade = 5;
    
    desc = "慈航静斋的轻功身法";
    can_enables = ["dodge"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: 2300,
                mz: 2300,
                dex: 281,
                int: 261,
                diff_downside_per: 15,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "比翼",
            distime: 60000,
            enable_skill: "dodge",
            mp: 6120,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 比翼
                // 10秒内不受负面状态影响。
                me.send_room("$N使出「比翼」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "10秒内不受负面状态影响。";
            },
        },
    };
}
