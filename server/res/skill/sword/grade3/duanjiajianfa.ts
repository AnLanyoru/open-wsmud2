import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "段家剑";
    id = "duanjiajianfa";
    grade = 3;

    desc = "大理段家的剑法";
    can_enables = ["sword"];
    attack_actions = [
        "$N手中$w一抖，剑身嗡嗡作响，一道<HIB>一阳指力</HIB>贯注剑尖，直刺$n$l",
        "$N长剑横削，劲力到处，$w发出<HIC>嗤嗤</HIC>声响，正是段家剑「<HIY>金玉满堂</HIY>」",
        "$N身法飘逸，$w左刺右劈，剑气纵横，段家剑法施展开来如<HIB>风拂垂柳</HIB>般洒向$n",
        "$N手腕一翻，$w自上而下斜斜劈落，剑势中正平和，暗藏<HIY>一阳指</HIY>神功",
        "$N剑尖颤动，幻出点点<HIB>寒星</HIB>，一招「<HIC>翡翠双收</HIC>」分刺$n数处大穴"
    ];
    slots = [
        {
            prop: 'yy_fy',
            value: (lv: number) => 10,
            format: (val: number) => '一阳剑气期间，如果对方躲闪将释放剑气',
        },
        {
            prop: 'yy_mp',
            value: (lv: number) => 10,
            format: (val: number) => '一阳剑气期间，命中后造成额外的内力伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + Math.floor(lv * 3 / 2),
                mz: 10 + Math.floor(lv * 8 / 5),
            },
        };
    }

    pfm_set: PerformData = {
        yi: {
            name: "一阳剑气",
            distime: 35000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var duration = calcYYDuration(lv);
                var per = calcYYPer(lv);
                me.send_room("<HIB>$N凝神聚气，将一阳指内力源源不断地注入$W之中，剑身瞬间笼罩了一层湛然青光！</HIB>", target);
                me.add_status({
                    id: "duanjiajianfa_yy",
                    name: "一阳剑气",
                    desc: "剑气附体，最终伤害提升",
                    duration: duration,
                    prop: {
                        add_sh_per: per,
                    },
                    start_msg: "<HIB>$N剑上青光大盛，一阳指力与剑法合二为一！</HIB>\n",
                    finish_msg: "<HIY>$N剑上青光渐渐消散，一阳剑气已尽。</HIY>\n",
                }, me);
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var duration = calcYYDuration(lv);
                var per = calcYYPer(lv);
                return "将内力贯入武器，" + toSec(int(duration)) + "秒内增加伤害" + per + "%";
            },
        },
        wu: {
            name: "无形剑气",
            distime: 35000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var per = calcWXPer(lv);
                me.send_room("<HIC>$N将一阳内力催动到极致，$W上剑气勃发，一道无形剑罡破空而出，凌厉无匹地射向$n！</HIC>", target);
                me.do_attack({
                    target: target,
                    gj: me.gj * per / 100,
                    mz: me.mz * 2,
                });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var per = calcWXPer(lv);
                return "将内力贯入武器，以剑气伤人，对敌方造成" + per + "%的伤害，命中增加100%";
            },
        },
    };
}

function calcYYDuration(lv: number): number {
    return 1000 + lv * 9;
}

function calcYYPer(lv: number): number {
    return 30 + int(lv / 100);
}

function calcWXPer(lv: number): number {
    return 110 + int(lv / 5);
}
