import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "寒冰真气";
    id = "hanbingzhenqi";
    grade = 4;
    
    desc = "嵩山派的绝学寒冰真气，至阴至寒，真气散发一股冰入骨髓的寒气。";
    can_enables = ["force"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '内力上限：+135000',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '附加寒冰真气时，额外造成4000伤害',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '附加寒冰真气时，可抵挡4000伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: 6 + Math.floor(lv * 1.75),
                max_hp: lv * 20,
                limit_mp: lv * 145,
                desc: "唯一：将你内力的70%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "寒冰",
            distime: 40000,
            enable_skill: "force",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 寒冰
                // 运起全身真气，在20秒内，使自己的伤害附加4000寒冰伤害，并使攻击你的敌人冻结，在15秒内减慢35%攻击速度。
                me.send_room("$N使出「寒冰」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "运起全身真气，在20秒内，使自己的伤害附加4000寒冰伤害，并使攻击你的敌人冻结，在15秒内减慢35%攻击速度。";
            },
        },
    };
}
