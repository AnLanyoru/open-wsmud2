import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "临济十二庄";
    id = "linjizhuang2";
    grade = 5;
    family = FAMILIES.EMEI;
    desc = "峨眉派内功心法";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: 35000,
                con: 336,
                fy: 2100,
                fy_per: 6,
                limit_mp: 280000,
                desc: "唯一将你内力的95%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "鹤翔庄",
            distime: 45000,
            enable_skill: "force",
            mp: 1020,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 鹤翔庄
                // 每两秒内恢复你20%点气血，持续5次，期间减少你受到的伤害25%
                me.send_room("$N使出「鹤翔庄」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "每两秒内恢复你20%点气血，持续5次，期间减少你受到的伤害25%";
            },
        },
        pfm_1: {
            name: "游龙庄",
            distime: 30000,
            enable_skill: "force",
            mp: 1020,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 游龙庄
                // 战斗中恢复自己和附近队友2541点气血，并消除负面状态。
                me.send_room("$N使出「游龙庄」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "战斗中恢复自己和附近队友2541点气血，并消除负面状态。";
            },
        },
    };
}
