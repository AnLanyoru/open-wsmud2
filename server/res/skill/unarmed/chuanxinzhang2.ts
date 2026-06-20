import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "穿心掌";
    id = "chuanxinzhang2";
    grade = 4;
    family = FAMILIES.SHASHOU;
    desc = "杀手楼的拳脚功夫，出招阴狠毒辣";
    can_enables = ["unarmed","parry"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '掌心雷附加的攻击力增加50%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '掌心雷造成昏迷的时间增加1秒',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.72),
                bj_per: 4,
                mz: Math.floor(lv * 1.71),
            },
            parry: {
                zj: Math.floor(lv * 1.42),
                ds: Math.floor(lv * 1.42),
                dex: 4 + Math.floor(lv * 0.14),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "掌心雷",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 掌心雷
                // 对敌人造成200%攻击力的伤害，命中后昏迷对方7秒
                me.send_room("$N使出「掌心雷」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成200%攻击力的伤害，命中后昏迷对方7秒";
            },
        },
    };
}
