import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "天羽奇剑";
    id = "tianyuqijian";
    grade = 3;
    
    desc = "飘渺峰灵鹫宫的剑法绝技";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '天女散花无视对方防御10%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '天羽诀额外附加30%攻击力',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 1320,
                mz: 1220,
                bj_per: 5,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "天女散花",
            distime: 20000,
            enable_skill: "sword",
            mp: 1887,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 天女散花
                // 进行数次攻击,敌人的防御越低抵挡的数量越少
                me.send_room("$N使出「天女散花」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "进行数次攻击,敌人的防御越低抵挡的数量越少";
            },
        },
        pfm_1: {
            name: "天羽诀",
            distime: 15000,
            enable_skill: "sword",
            mp: 2448,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 天羽诀
                // 使用天羽四奇剑攻击敌人，梅剑：无视防御，兰剑：无法招架，竹剑：无法躲闪，菊剑：必定暴击
                me.send_room("$N使出「天羽诀」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使用天羽四奇剑攻击敌人，梅剑：无视防御，兰剑：无法招架，竹剑：无法躲闪，菊剑：必定暴击";
            },
        },
    };
}
