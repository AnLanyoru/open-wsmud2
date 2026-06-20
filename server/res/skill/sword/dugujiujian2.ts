import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "独孤九剑";
    id = "dugujiujian2";
    grade = 5;
    family = FAMILIES.HUASHAN;
    desc = "为独孤求败所创，以无招胜有招的宗旨胜破天下武功。";
    can_enables = ["sword","parry"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 2010,
                gjsd: 250,
                bj_per: 4,
                mz: 2010,
            },
            parry: {
                zj: 2010,
                str: 334,
                dex: 334,
            },
            // Global/base properties:
            // {"add_sh_per":8} 
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "无招",
            distime: 30000,
            enable_skill: "sword",
            mp: 1020,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 无招
                // 独孤九剑之无招胜有招，15秒内你的招式无迹可寻使敌人难以破解，出招速度加快到极限，增加40%攻击，20%命中。
                me.send_room("$N使出「无招」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "独孤九剑之无招胜有招，15秒内你的招式无迹可寻使敌人难以破解，出招速度加快到极限，增加40%攻击，20%命中。";
            },
        },
        pfm_1: {
            name: "破字诀",
            distime: 30000,
            enable_skill: "sword",
            mp: 1020,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 破字诀
                // 天下武功，无招不破，使用后你在8秒内大幅增加你的招架几率，招架成功后立即强力反击
                me.send_room("$N使出「破字诀」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "天下武功，无招不破，使用后你在8秒内大幅增加你的招架几率，招架成功后立即强力反击";
            },
        },
        pfm_2: {
            name: "破气诀",
            distime: 20000,
            enable_skill: "sword",
            mp: 1020,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 破气诀
                // 独孤九剑之破气式，精准攻击敌方气海要穴，无法招架，命中后减少敌人847内力，并使敌人忙乱10秒。
                me.send_room("$N使出「破气诀」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "独孤九剑之破气式，精准攻击敌方气海要穴，无法招架，命中后减少敌人847内力，并使敌人忙乱10秒。";
            },
        },
    };
}
