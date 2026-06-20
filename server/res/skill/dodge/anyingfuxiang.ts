import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "暗影浮香";
    id = "anyingfuxiang";
    grade = 3;
    
    desc = "桃花岛的轻功身法";
    can_enables = ["dodge"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '暗影附加的命中增加5%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: 2100,
                mz: 1600,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "暗影",
            distime: 32000,
            enable_skill: "dodge",
            mp: 1020,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 暗影
                // 10秒内增加你25%命中
                me.send_room("$N使出「暗影」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "10秒内增加你25%命中";
            },
        },
    };
}
