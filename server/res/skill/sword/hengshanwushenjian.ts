import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "衡山五神剑";
    id = "hengshanwushenjian";
    grade = 3;
    
    desc = "衡山派的绝技，因紫盖、芙蓉、石廪、祝融、天柱五峰而得名";
    can_enables = ["sword","parry"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '每次装备为招架时可设置五神赋召唤目标',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '五神剑出招时，每剑分别附加五神的特殊效果(攻击，破防，命中，不可躲闪，不可招架)',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: Math.floor(lv * 1.51),
                str: Math.floor(lv * 0.168),
                mz: Math.floor(lv * 1.51),
            },
            parry: {
                zj: Math.floor(lv * 1.51),
                str: Math.floor(lv * 0.168),
                fy: Math.floor(lv * 1.51),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "五神剑",
            distime: 13000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 五神剑
                // 瞬间对敌人攻击5次，每次造成120%伤害。
                me.send_room("$N使出「五神剑」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "瞬间对敌人攻击5次，每次造成120%伤害。";
            },
        },
        pfm_1: {
            name: "五神赋",
            distime: 30000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 五神赋
                // 召唤祝融，石廪，芙蓉，鹤翔，天柱之一，20秒内随机增加你的某项战斗属性30%
                me.send_room("$N使出「五神赋」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "召唤祝融，石廪，芙蓉，鹤翔，天柱之一，20秒内随机增加你的某项战斗属性30%";
            },
        },
    };
}
