import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "笔翰如流";
    id = "bihanruliu";
    grade = 3;
    
    desc = "梅庄三庄主秃笔翁所创轻功，将书法笔势融入步法，灵动飘逸如笔墨流淌";
    can_enables = ["dodge"];
    learn_condition = {
      "dex1": 25
    };
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '行云流水额外减少攻击间隔0.5秒',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '行云流水额外增加3000躲闪',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: 5 + Math.floor(lv * 1.33),
                mz: Math.floor(lv * 1.23),
                con: 5 + Math.floor(lv * 0.08),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "行云流水",
            distime: 35000,
            enable_skill: "dodge",
            mp: 25,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 行云流水
                // 11秒内你的攻击间隔减少1秒，增加3000躲闪。
                me.send_room("$N使出「行云流水」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "11秒内你的攻击间隔减少1秒，增加3000躲闪。";
            },
        },
    };
}
