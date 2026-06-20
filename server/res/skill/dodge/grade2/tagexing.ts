import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "踏歌行";
    id = "tagexing";
    grade = 2;
    
    desc = "青城派的轻功身法";
    can_enables = ["dodge"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '踏歌行额外提升自身攻击1000点',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '踏歌行额外提升自身躲闪1000点',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: Math.floor(lv * 1.34),
                dex: Math.floor(lv * 0.126),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "踏歌行",
            distime: 30000,
            enable_skill: "dodge",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 踏歌行
                // 20秒内，提升自身攻击力2000点，躲闪2500点。
                me.send_room("$N使出「踏歌行」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "20秒内，提升自身攻击力2000点，躲闪2500点。";
            },
        },
    };
}
