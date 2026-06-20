import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "越女剑法";
    id = "yuenvjianfa";
    grade = 4;
    
    desc = "传说是古代一位女子所创，剑势轻盈灵动如猿猱穿林，迅捷中暗藏杀机。";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '猿跃式每多命中一个敌人减少5秒冷却',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '破竹式追加次数增加3次',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '破竹式附加额外的暴击率13%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 16 + Math.floor(lv * 1.1),
                mz: 2 + Math.floor(lv * 1.82),
                dex: Math.floor(lv * 0.14),
                diff_fy_per: 6,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "猿跃式",
            distime: 30000,
            enable_skill: "sword",
            mp: 75,
            release_time: 1000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 猿跃式
                // 灵猿纵跃般发动数段突袭所有敌人，敌人数量和身法会增加次数。
                me.send_room("$N使出「猿跃式」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "灵猿纵跃般发动数段突袭所有敌人，敌人数量和身法会增加次数。";
            },
        },
        pfm_1: {
            name: "破竹式",
            distime: 10000,
            enable_skill: "sword",
            mp: 90,
            release_time: 1500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 破竹式
                // 暴击后会继续追加攻击，且叠加15%忽视防御，每追加一次增加5秒冷却，最多追加4次
                me.send_room("$N使出「破竹式」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "暴击后会继续追加攻击，且叠加15%忽视防御，每追加一次增加5秒冷却，最多追加4次";
            },
        },
    };
}
