import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "玄天指";
    id = "xuantianzhi";
    grade = 3;
    
    desc = "梅庄二庄主黑白子的得意绝技，指力阴寒强劲，可隔空点穴，伤人于丈许之外(未完善)";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '寒阴指劲在对方躲闪失败后即可起效',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '寒阴指劲降低攻速效果+10%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.43),
                mz: 5 + Math.floor(lv * 1.43),
                dex: Math.floor(lv * 0.086),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "寒阴指劲",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 15,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 寒阴指劲
                // 打出蕴含阴寒之气的指劲，造成自身300%攻击力的伤害，使目标10秒内技能攻击速度降低30%
                me.send_room("$N使出「寒阴指劲」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "打出蕴含阴寒之气的指劲，造成自身300%攻击力的伤害，使目标10秒内技能攻击速度降低30%";
            },
        },
    };
}
