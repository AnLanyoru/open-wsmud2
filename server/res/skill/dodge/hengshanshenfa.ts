import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "恒山身法";
    id = "hengshanshenfa";
    grade = 2;
    
    desc = "恒山派的轻功身法";
    can_enables = ["dodge"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '灵虚额外增加5%躲闪',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '灵虚额外增加5%防御',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: Math.floor(lv * 1.1),
                fy: Math.floor(lv * 1.2),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "灵虚",
            distime: 30000,
            enable_skill: "dodge",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 灵虚
                // 11秒内增加你20%躲闪，防御提高20%
                me.send_room("$N使出「灵虚」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "11秒内增加你20%躲闪，防御提高20%";
            },
        },
    };
}
