import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "金蛇锥法";
    id = "jinshezhui";
    grade = 2;
    
    desc = "金蛇郎君创造的一门暗器功法";
    can_enables = ["throwing"];
    attack_actions = SKILL.get("throwing")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '千蛇出洞命中增加10%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '千蛇出洞最大次数增加1次',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            throwing: {
                gj: 1010,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "千蛇出洞",
            distime: 10000,
            enable_skill: "throwing",
            mp: 1020,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 千蛇出洞
                // 使用暗器对敌人发动攻击
                me.send_room("$N使出「千蛇出洞」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使用暗器对敌人发动攻击";
            },
        },
    };
}
