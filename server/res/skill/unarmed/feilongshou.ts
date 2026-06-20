import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "飞龙探云手";
    id = "feilongshou";
    grade = 2;
    family = FAMILIES.LIUSHAN;
    desc = "六扇门的拳脚功夫，虽然没什么战斗力";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '飞龙探云手偷盗的有效等级增加250',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                mz: 2024,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "探龙",
            distime: 18000,
            enable_skill: "unarmed",
            mp: 1020,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 探龙
                // 偷盗你附近NPC的物品，只可在非公共区域使用
                me.send_room("$N使出「探龙」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "偷盗你附近NPC的物品，只可在非公共区域使用";
            },
        },
    };
}
