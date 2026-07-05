import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "弹指神通";
    id = "tanzhishengong";
    grade = 4;
    is_public = true;
    
    // 原始描述：桃花岛黄药师的绝技，以指弹物，劲力穿空，伤人于百步之外，弹指间取人性命
    desc = "桃花岛的绝技，弹指神通";
    can_enables = ["unarmed"];
    attack_actions = [
        "$N屈指一弹，一缕凌厉指风破空而出，直取$n的$l",
        "$N食指轻扣拇指，猛地弹出，一道无形劲气直射$n的$l",
        "$N指尖微颤，一道指风无声无息地射向$n",
        "$N袖袍轻拂，暗中屈指一弹，一道锐利指风已到$n面前",
        "$N双指连弹，数道指风分袭$n周身大穴",
        "$N淡然一笑，手指轻轻一弹，一道劲气已破空而至",
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.82),
                str: 1 + Math.floor(lv * 0.2),
                mz: lv * 1,
            },
        };
    }

    pfm_set: PerformData = {
        tanzhijinglei: {
            name: "弹指惊雷",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var neiliDrain = Math.floor(target.mp * 0.15);
                target.add_mp(-neiliDrain);

                me.send_room("<HIW>$N食指扣在拇指之下，猛地弹出，只听一声尖锐破空，一道惊雷般的指风直射$n！</HIW>", target);
                me.do_attack({ target, gj: Math.floor(me.gj * 2), mz: me.mz });

                if (target.hp > 0 && neiliDrain > 0) {
                    target.send_room("<HIR>$n的内力被弹指神通的真气打散，流失了一部分！</HIR>", me);
                }

                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成200%攻击力的伤害，命中后减少对方15%的内力";
            },
        },
        dianxue: {
            name: "点穴",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var busyDuration = dianxueBusy(lv);

                me.send_room("<HIW>$N运指如风，一缕指劲精准地射向$n的要穴！</HIW>", target);
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
                return "弹指神通之点穴大法，命中后造成伤害，并使敌人忙乱" + toSec(busyDuration) + "秒。";
            },
        },
    };
}

function dianxueBusy(lv: number): number {
    return 5500 + lv * 4.5;
}
