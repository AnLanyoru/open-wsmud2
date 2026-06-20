import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "独孤剑诀";
    id = "dugujiujian4";
    grade = 6;
    family = FAMILIES.HUASHAN;
    desc = "上古剑门镇派之术，无剑无我，手持天地";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 3000,
                gjsd: 300,
                add_sh_per: 10,
                mz_per: 10,
                bj_per: 4,
                desc: "无剑你的剑无法被卸下; 无我战斗中进入忘我境界，持续提高你的战斗力",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "剑意",
            distime: 30000,
            enable_skill: "sword",
            mp: 96390,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 剑意
                // 独孤剑诀之剑意，7秒内你的招式无迹可寻使敌人难以破解，出招速度加快到极限，增加70%最终伤害，命中，招架几率。
                me.send_room("$N使出「剑意」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "独孤剑诀之剑意，7秒内你的招式无迹可寻使敌人难以破解，出招速度加快到极限，增加70%最终伤害，命中，招架几率。";
            },
        },
        pfm_1: {
            name: "剑来",
            distime: 60000,
            enable_skill: "sword",
            mp: 109650,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 剑来
                // 召唤飞剑攻击附近敌人，飞剑持续9秒，你的攻击会对敌人造成60%攻击力的真实伤害
                me.send_room("$N使出「剑来」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "召唤飞剑攻击附近敌人，飞剑持续9秒，你的攻击会对敌人造成60%攻击力的真实伤害";
            },
        },
    };
}
