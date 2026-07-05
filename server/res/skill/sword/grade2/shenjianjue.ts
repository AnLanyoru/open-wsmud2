import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "神剑诀";
    id = "shenjianjue";
    grade = 2;

    // 原始描述：卓不凡在长白山得到剑谱，苦练二十年，自觉天下无敌，自称剑神
    desc = "卓不凡在长白山得到剑谱,苦练二十年，自觉天下无敌,自称剑神";
    can_enables = ["sword"];
    attack_actions = [
        "$N手中$w一挺，剑气纵横，如<HIW>白虹贯日</HIW>般刺向$n的$l",
        "$N深吸一口气，$w上陡然生出一道<HIC>剑芒</HIC>，吞吐不定，直射$n$l",
        "$N身形飘忽，$w虚实相生，一道<HIW>无形剑气</HIW>破空而出，直取$n$l",
        "$N剑势大开大阖，$w舞动间<HIC>寒光</HIC>四射，如<HIW>银河倒泻</HIW>般卷向$n",
        "$N一声清啸，$w疾挥，一道<HIC>凌厉剑气</HIC>破空而至，直刺$n的$l"
    ];
    slots = [
        {
            prop: 'jm_bj',
            value: (lv: number) => 10,
            format: (val: number) => '剑芒额外增加8%暴击伤害',
        },
        {
            prop: 'jq_sh',
            value: (lv: number) => 10,
            format: (val: number) => '剑气造成的伤害增加43%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                mz: lv * 2 + 100,
                bj_per: 1 + int(lv / 300),
            },
        };
    }

    pfm_set: PerformData = {
        mang: {
            name: "剑芒",
            distime: 30000,
            enable_skill: "sword",
            mp: 50,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var bj = calcJianmangBj(lv);
                var duration = calcJianmangDuration(lv);
                me.send_room("<HIW>$N一声冷哼，内力催动之下$W剑芒暴长数尺，光华璀璨，令人不敢直视！</HIW>", target);
                me.add_status({
                    id: "shenjianjue_jm",
                    name: "剑芒",
                    desc: "剑芒护体，暴击率提升",
                    duration: duration,
                    prop: {
                        bj_per: bj,
                    },
                    start_msg: "<HIW>$N剑上芒尾大盛，如一泓秋水流转不定！</HIW>\n",
                    finish_msg: "<HIW>$N剑上芒尾渐渐收敛，光华散去。</HIW>\n",
                }, me);
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var bj = calcJianmangBj(lv);
                var duration = calcJianmangDuration(lv);
                return "催动内力使你的剑锋芒毕露，" + toSec(int(duration)) + "秒内增加" + bj + "%的暴击率";
            },
        },
        qi: {
            name: "剑气",
            distime: 20000,
            enable_skill: "sword",
            mp: 50,
            release_time: 3700,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var per = calcJianqiPer(lv);
                me.send_room("<HIW>$N虚虚实实一剑刺出，突然一道凌厉剑气从$W尖端激射而出，破空数丈直取$n！</HIW>", target);
                var par: DoAttackPar = {
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz,
                };
                me.do_attack(par);
                if (par.iscirt) {
                    me.clear_distime("sword/qi");
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var per = calcJianqiPer(lv);
                return "以剑气从数里之外伤人，对敌人造成" + per + "%伤害，如果暴击则冷却立刻完成";
            },
        },
    };
}

function calcJianmangBj(lv: number): number {
    return 3 + int(lv / 200);
}

function calcJianmangDuration(lv: number): number {
    return 5000 + lv * 3;
}

function calcJianqiPer(lv: number): number {
    return 50 + int(lv / 10);
}
