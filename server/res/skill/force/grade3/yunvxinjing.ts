import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "玉女心经";
    id = "yunvxinjing";
    grade = 3;
    
    desc = "古墓派内功绝学，以轻灵见长";
    can_enables = ["force"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '内力上限：+125000',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '容貌：+2',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '容貌超过20后额外增加轻舞的暴击',
        },
        {
            prop: 'slot_3',
            value: (lv: number) => 10,
            format: (val: number) => '容貌超过20后额外增加轻舞的忽视防御',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: 4 + Math.floor(lv * 1.4),
                ds: 4 + Math.floor(lv * 1.4),
                per: 3,
                limit_mp: lv * 100,
                desc: "唯一将你内力的80%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "轻舞",
            distime: 28000,
            enable_skill: "force",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 轻舞
                // 15秒内提高你13%的攻击，躲闪，增加你的容貌
                me.send_room("$N使出「轻舞」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "15秒内提高你13%的攻击，躲闪，增加你的容貌";
            },
        },
    };
}
