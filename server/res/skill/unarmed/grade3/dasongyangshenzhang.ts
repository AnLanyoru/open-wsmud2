import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "大嵩阳神掌";
    id = "dasongyangshenzhang";
    grade = 3;
    
    desc = "大嵩阳神掌乃是嵩山派绝学，以变化繁复，出手迅捷见称。(未完善)";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '无影掌附加攻击力增加100%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '无影掌命中增加35%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.3),
                gjsd: 200,
                mz: Math.floor(lv * 1.22),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "无影掌",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 无影掌
                // 对敌人造成300%的伤害，命中后使敌人忙乱8秒。
                me.send_room("$N使出「无影掌」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成300%的伤害，命中后使敌人忙乱8秒。";
            },
        },
    };
}
