import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "参合指";
    id = "canhezhi";
    grade = 4;
    
    desc = "慕容世家的一式家传指法(未完善)";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '参合指的最大层数可达到20层',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '参合之殇不会重置参合层数',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.52),
                mz: Math.floor(lv * 1.52),
                bj_per: 4,
                int: Math.floor(lv * 0.169),
                desc: "命中后使敌人受到的伤害增加1001可叠加10层",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "参合之殇",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 参合之殇
                // 对敌人造成伤害，每层参合状态增加你30%伤害，如果对方层数大于4层将昏迷5秒。
                me.send_room("$N使出「参合之殇」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成伤害，每层参合状态增加你30%伤害，如果对方层数大于4层将昏迷5秒。";
            },
        },
    };
}
