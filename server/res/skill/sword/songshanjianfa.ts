import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "嵩山剑法";
    id = "songshanjianfa";
    grade = 3;
    
    desc = "嵩山派绝学，剑法气象森严，端严雄伟。";
    can_enables = ["sword","parry"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '万岳朝宗的内力消耗降低20%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '万岳朝宗附加的内力增加20%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + lv * 2,
                mz: 20 + lv * 1,
                str: Math.floor(lv * 0.127),
            },
            parry: {
                zj: Math.floor(lv * 2.31),
                max_hp: lv * 7,
                con: Math.floor(lv * 0.127),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "万岳朝宗",
            distime: 10000,
            enable_skill: "sword",
            mp: 0,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 万岳朝宗
                // 威力巨大的一式剑法，消耗你30%的当前内力，对敌人造成等量伤害。
                me.send_room("$N使出「万岳朝宗」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "威力巨大的一式剑法，消耗你30%的当前内力，对敌人造成等量伤害。";
            },
        },
    };
}
