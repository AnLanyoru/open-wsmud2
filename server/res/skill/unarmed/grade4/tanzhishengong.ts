import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { PropMap } from "../../../../types/props.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 70 */
export default class extends SKILL {
    name = "弹指神通";
    id = "tanzhishengong";
    grade = 4;

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

    slots = [
        {
            prop: 'tzsg_xue_nl',
            value: (lv: number) => 13,
            format: (val: number) => '点穴将附加' + val + '%内力伤害，并减少对方内力',
        },
        {
            prop: 'tzsg_nl_sh',
            value: (lv: number) => 2,
            format: (val: number) => '敌人内力每降低1%弹指神通造成的伤害增加' + val + '%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 20 + Math.floor(lv * 1.8),
                str: 1 + Math.floor(lv / 5),
                mz: lv * 1,
            },
        };
    }

    pfm_set: PerformData = {
        lei: {
            name: "弹指惊雷",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var neiliDrain = Math.floor(target.mp * 0.15);
                target.add_mp(-neiliDrain);

                const nlSh = me.query_prop("tzsg_nl_sh");
                const mpMissingRatio = target.max_mp > 0 ? (1 - target.mp / target.max_mp) * 100 : 0;
                const nlBonus = 1 + mpMissingRatio * nlSh / 100;
                const dmgMulti = 2 * nlBonus;

                me.send_room("<HIW>$N食指扣在拇指之下，猛地弹出，只听一声尖锐破空，一道惊雷般的指风直射$n！</HIW>", target);
                me.do_attack({ target, gj: Math.floor(me.gj * dmgMulti), mz: me.mz });

                if (target.hp > 0 && neiliDrain > 0) {
                    target.send_room("<HIR>$n的内力被弹指神通的真气打散，流失了一部分！</HIR>", me);
                }

                me.end_attack(target);
            },
            query_desc: function(_me: CHARACTER, _lv: number) {
                return "对敌人造成200%攻击力的伤害，命中后减少对方15%的内力";
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
                const xueNl = me.query_prop("tzsg_xue_nl");

                const par: DoAttackPar = { target, gj: me.gj, mz: me.mz };
                if (xueNl > 0) {
                    par.gj = me.gj + Math.floor(me.mp * xueNl / 100);
                }

                me.send_room("<HIW>$N运指如风，一缕指劲精准地射向$n的要穴！</HIW>", target);
                me.do_attack(par);

                if (target.hp > 0) {
                    target.add_status({
                        id: "busy",
                        name: "忙乱",
                        duration: busyDuration,
                        downside: true,
                    }, me);

                    if (xueNl > 0) {
                        const neiliDrain = Math.floor(target.mp * xueNl / 100);
                        target.add_mp(-neiliDrain);
                    }
                }

                me.end_attack(target);
            },
            query_desc: function(_me: CHARACTER, lv: number) {
                var busyDuration = dianxueBusy(lv);
                return "弹指神通之点穴大法，命中后造成伤害，并使敌人忙乱" + toSec(busyDuration) + "秒。";
            },
        },
    };
}

function dianxueBusy(lv: number): number {
    return 5500 + lv * 4.5;
}
