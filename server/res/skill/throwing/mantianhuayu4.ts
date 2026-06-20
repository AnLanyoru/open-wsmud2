import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "天谕";
    id = "mantianhuayu4";
    grade = 6;
    family = FAMILIES.SHASHOU;
    desc = "上古法家不传之秘，替天行法";
    can_enables = ["throwing"];
    attack_actions = SKILL.get("throwing")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            throwing: {
                gj: lv * 3,
                mz: lv * 3,
                bj_per: 7,
                mz_per: 8,
                add_sh_per: 10,
                diff_fy_per: 10,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "审判",
            distime: 60000,
            enable_skill: "throwing",
            mp: 1120,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 审判
                // 代天行法，发起审判，使敌人无法移动
                me.send_room("$N使出「审判」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "代天行法，发起审判，使敌人无法移动";
            },
        },
        pfm_1: {
            name: "天罚",
            distime: 13000,
            enable_skill: "throwing",
            mp: 1910,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 天罚
                // 使用暗器引天雷攻击敌人，对审判中的敌人造成额外伤害并无法抵抗暴击
                me.send_room("$N使出「天罚」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使用暗器引天雷攻击敌人，对审判中的敌人造成额外伤害并无法抵抗暴击";
            },
        },
    };
}
