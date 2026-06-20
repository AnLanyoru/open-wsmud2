import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "银索金铃";
    id = "yinsuojinling";
    grade = 3;
    
    desc = "古墓派武功，招式精妙，变幻莫测。";
    can_enables = ["whip"];
    attack_actions = SKILL.get("whip")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            whip: {
                gj: 1010,
                mz: 1210,
                dex: 210,
                con: 210,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "隔空点穴",
            distime: 30000,
            enable_skill: "whip",
            mp: 1020,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 隔空点穴
                // 命中后使敌人10秒内处于忙乱状态。
                me.send_room("$N使出「隔空点穴」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "命中后使敌人10秒内处于忙乱状态。";
            },
        },
    };
}
