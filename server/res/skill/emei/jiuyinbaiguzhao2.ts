import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "九阴白骨爪";
    id = "jiuyinbaiguzhao2";
    source_skill = "jiuyinbaiguzhao";
    grade = 4;
    family = FAMILIES.EMEI;
    desc = "九阴真经里记载的外门功夫，阴狠毒辣";
    can_enables = ["unarmed","parry"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '夺魄造成的伤害增加30%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '风卷残云最低攻击次数+1',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 20 + lv * 2,
                mz: 20 + lv * 2,
                diff_fy_per: 6,
            },
            parry: {
                zj: 20 + lv * 2,
                fy: 20 + lv * 2,
                max_hp: lv * 20,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "夺魄",
            distime: 18000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 夺魄
                // 快速狠辣的攻击，命中后对敌人造成你攻击力300%的伤害，并使敌方昏迷8秒。
                me.send_room("$N使出「夺魄」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "快速狠辣的攻击，命中后对敌人造成你攻击力300%的伤害，并使敌方昏迷8秒。";
            },
        },
        pfm_1: {
            name: "风卷残云",
            distime: 18000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 风卷残云
                // 对敌人进行快速攻击，对方的气血每降低20%，你的攻击次数增加1次
                me.send_room("$N使出「风卷残云」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人进行快速攻击，对方的气血每降低20%，你的攻击次数增加1次";
            },
        },
    };
}
