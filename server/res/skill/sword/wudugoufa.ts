import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "五毒钩法";
    id = "wudugoufa";
    grade = 3;
    
    desc = "五毒教的高级剑法，阴狠毒辣";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '金钩锁魂失败后也可以触发后续效果',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '金钩锁魂判定成功的有效等级增加60级',
        },
        {
            prop: 'slot_2',
            value: (lv: number) => 10,
            format: (val: number) => '毒伤效果额外附加3250点伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                str: 201,
                mz: 1410,
                desc: "当你命中敌人后对敌人造成毒素伤害",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "金钩锁魂",
            distime: 25000,
            enable_skill: "sword",
            mp: 1020,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 金钩锁魂
                // 打掉对方兵器，成功后继续攻击对方4次，等级越高成功率越高
                me.send_room("$N使出「金钩锁魂」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "打掉对方兵器，成功后继续攻击对方4次，等级越高成功率越高";
            },
        },
    };
}
