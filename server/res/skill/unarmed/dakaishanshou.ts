import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "大开山手";
    id = "dakaishanshou";
    grade = 2;
    family = FAMILIES.WULANG;
    desc = "传闻是无浪门前辈在某隐秘之地发现的失传武学，此技融采矿开山之法与徒手硬功于一体，堪称开碑裂石的霸道武学。";
    can_enables = ["unarmed","parry"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '点石成金获取对方的防御和免伤上限增加10%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '点石成金会同时对敌人造成伤害，命中后减少对方对应防御',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '点石成金可偷取防御包括对方增益部分',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 9 + Math.floor(lv * 0.6),
                diff_fy_per: 4,
            },
            parry: {
                gj: Math.floor(lv * 0.61),
                diff_sh_per: 4,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "破岩击",
            distime: 15000,
            enable_skill: "unarmed",
            mp: 15,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 破岩击
                // 凝聚开山之力的重击，造成150%攻击力伤害，无视对方21%防御
                me.send_room("$N使出「破岩击」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "凝聚开山之力的重击，造成150%攻击力伤害，无视对方21%防御";
            },
        },
        pfm_1: {
            name: "点石成金",
            distime: 60000,
            enable_skill: "unarmed",
            mp: 25,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 点石成金
                // 大开山手技，获取目标20%防御和免伤7秒内强化自身
                me.send_room("$N使出「点石成金」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "大开山手技，获取目标20%防御和免伤7秒内强化自身";
            },
        },
    };
}
