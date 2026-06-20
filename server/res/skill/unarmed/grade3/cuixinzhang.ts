import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "摧心掌";
    id = "cuixinzhang";
    grade = 3;
    
    desc = "催心掌乃是青城绝学，中此掌者，外在并无任何伤痕，但内里的五脏六腑已然碎裂";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '催心掌阴毒爆发时造成120%催心掌力的伤害',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '命中后招架失败也可触发催心效果',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.52),
                mz: Math.floor(lv * 1.42),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "催心",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 催心
                // 对敌人造成你200%伤害，并使敌人受到阴毒伤害，7秒后毒发昏迷4秒。
                me.send_room("$N使出「催心」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成你200%伤害，并使敌人受到阴毒伤害，7秒后毒发昏迷4秒。";
            },
        },
    };
}
