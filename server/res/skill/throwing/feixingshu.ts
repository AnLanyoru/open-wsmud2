import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "飞星术";
    id = "feixingshu";
    grade = 2;
    
    desc = "星宿派的暗器手法";
    can_enables = ["throwing"];
    attack_actions = SKILL.get("throwing")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '星雨最高命中数量：+1',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '星雨最低命中数量：+1',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            throwing: {
                gj: 4 + Math.floor(lv * 1.4),
                ds: 4 + Math.floor(lv * 1.4),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "星雨",
            distime: 10000,
            enable_skill: "throwing",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 星雨
                // 使用暗器对敌人发动攻击，你的命中和对方的躲闪差距越大命中的暗器数量越多
                me.send_room("$N使出「星雨」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使用暗器对敌人发动攻击，你的命中和对方的躲闪差距越大命中的暗器数量越多";
            },
        },
    };
}
