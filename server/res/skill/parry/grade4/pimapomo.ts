import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "披麻泼墨";
    id = "pimapomo";
    grade = 4;
    
    desc = "梅庄四庄主丹青生所创武功，将泼墨画技与披麻皴法融入功法，招架时如笔墨流转，化去攻势";
    can_enables = ["parry"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '反势可累计的伤害延长2秒',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '缠势的判定成功的命中有效值增加20%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            parry: {
                zj: Math.floor(lv * 1.83),
                fy: Math.floor(lv * 1.82),
                diff_bj: 3,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "反势",
            distime: 35000,
            enable_skill: "parry",
            mp: 40,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 反势
                // 将你最近3秒内受到伤害一次性反击给当前敌人，范围在100-1100%攻击力之间
                me.send_room("$N使出「反势」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "将你最近3秒内受到伤害一次性反击给当前敌人，范围在100-1100%攻击力之间";
            },
        },
        pfm_1: {
            name: "缠势",
            distime: 40000,
            enable_skill: "parry",
            mp: 70,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 缠势
                // 以剑势缠绕目标9秒，使其攻击速度降低22%，防御降低2000。
                me.send_room("$N使出「缠势」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "以剑势缠绕目标9秒，使其攻击速度降低22%，防御降低2000。";
            },
        },
    };
}
