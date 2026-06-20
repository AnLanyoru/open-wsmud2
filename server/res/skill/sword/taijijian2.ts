import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "太极剑法";
    id = "taijijian2";
    grade = 5;
    family = FAMILIES.WUDANG;
    desc = "由武当祖师张三丰所创，武当派不传之秘，太极三绝技之一";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 2020,
                mz: 2020,
                zj: 2020,
                mz_per: 6,
            },
            // Global/base properties:
            // {"int":176,"zj_per":8} 
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "缠字诀",
            distime: 28300,
            enable_skill: "sword",
            mp: 510,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 缠字诀
                // 以连绵不绝的攻势迷惑附近敌人，使之无法脱身，13秒内处于忙乱状态，每命中多一人冷却增加9秒。
                me.send_room("$N使出「缠字诀」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "以连绵不绝的攻势迷惑附近敌人，使之无法脱身，13秒内处于忙乱状态，每命中多一人冷却增加9秒。";
            },
        },
        pfm_1: {
            name: "连字诀",
            distime: 15000,
            enable_skill: "sword",
            mp: 510,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 连字诀
                // 快速出剑，瞬间对附近敌人快速攻击7次，攻击中命中增加100%，附加自己3%的内力伤害
                me.send_room("$N使出「连字诀」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "快速出剑，瞬间对附近敌人快速攻击7次，攻击中命中增加100%，附加自己3%的内力伤害";
            },
        },
        pfm_2: {
            name: "随字决",
            distime: 20000,
            enable_skill: "sword",
            mp: 510,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 随字决
                // 造成300%攻击力的伤害，命中后使对方在13秒内降低15%命中和躲闪
                me.send_room("$N使出「随字决」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "造成300%攻击力的伤害，命中后使对方在13秒内降低15%命中和躲闪";
            },
        },
    };
}
