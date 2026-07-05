import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "一阳指";
    id = "yiyangzhi";
    grade = 4;

    // 原始描述：大理段氏绝学，以指代剑，一阳初动，万物生发，指力所及，无坚不摧，乃天下一等一的指法
    desc = "大理段家的绝技一阳指";
    can_enables = ["unarmed"];
    attack_actions = [
        "$N食指竖立，一缕纯阳指力破空而出，直取$n的$l",
        "$N一指点出，指风凌厉，隐挟风雷之声，疾射$n的$l",
        "$N运起一阳指神功，指尖泛出淡淡金光，疾点$n的$l",
        "$N身形微动，一指点出，看似轻描淡写，实则暗藏杀机",
        "$N凝神运指，隔空一指向$n的$l点去，指力破空呼啸",
        "$N朗声长笑，食指凌空一点，一道纯阳指力直刺$n的$l",
    ];

    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '一指乾坤的伤害额外增加60%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '点穴将使敌人昏迷最多10秒',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 20 + Math.floor(lv * 9 / 5),
                str: 1 + Math.floor(lv / 5),
                mz: lv * 1,
            },
        };
    }

    pfm_set: PerformData = {
        kun: {
            name: "一指乾坤",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                me.send_room("<HIC>$N神色凛然，一指点出，正是大理段氏不传之秘——一指乾坤！指力所及，乾坤倒转！</HIC>", target);
                me.do_attack({ target, gj: Math.floor(me.gj * 1.5), mz: me.mz, no_parry: true });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成150%攻击力的伤害，无法防御";
            },
        },
        xue: {
            name: "点穴",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var busyDuration = dianxueBusy(lv);

                me.send_room("<HIC>$N运起一阳指神功，食指疾出，精准地点向$n的穴道！</HIC>", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });

                if (target.hp > 0) {
                    target.add_status({
                        id: "busy",
                        name: "忙乱",
                        duration: busyDuration,
                        downside: true,
                    }, me);
                }

                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var busyDuration = dianxueBusy(lv);
                return "一阳指之点穴大法，命中后造成伤害，并使敌人忙乱" + toSec(busyDuration) + "秒。";
            },
        },
    };
}

function dianxueBusy(lv: number): number {
    return 5500 + lv * 4.5;
}
