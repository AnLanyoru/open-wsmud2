import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "魔剑";
    id = "mojian";
    grade = 6;
    is_public = true;
    
    // 原始描述：剑魔独孤求败以剑入魔后使用的剑法，剑势狂暴霸道，有我无敌，一剑既出，万魔臣服。
    desc = "剑魔独孤求败以剑入魔后使用的剑法";
    can_enables = ["sword","parry"];
    attack_actions = [
        "$N仰天长啸，$w魔气滔天，一招「<RED>群魔乱舞</RED>」，剑气如狂魔乱舞席卷$n",
        "$N双目赤红，$w狂挥而出，正是「<MAG>魔焰滔天</MAG>」，狂暴剑气吞天噬地涌向$n",
        "$N$w一指，天地变色，一招「<RED>万魔朝宗</RED>」，无数魔影随剑扑向$n",
        "$N狂笑一声，$w大开大阖，正是「<HIR>血战八方</HIR>」，剑气纵横八方斩向$n的$l",
        "$N$w魔气森森，一招「<MAG>魔临天下</MAG>」，剑势如九幽魔域降临笼罩$n",
        "$N身化残影，$w如狂风骤雨，正是「<RED>疯魔乱剑</RED>」，毫无章法却凌厉无比地攻向$n",
        "$N$w举天，引动九霄魔气，一招「<HIR>天魔降世</HIR>」，剑气如天崩地裂劈向$n",
        "$N一声暴喝，$w直劈而下，正是「<MAG>魔剑裂空</MAG>」，剑光撕裂虚空斩向$n的$l"
    ];
    parry_actions = [
        "$n狂吼一声，$w魔气大盛，硬生生将$P的攻势震开",
        "$n$w横劈，以攻为守，$P不得不变招自保",
        "$n周身魔气缭绕，$w以诡异的角度反撩$P的$l",
        "$n狞笑一声，$w不退反进，与$P以命换命"
    ];
    learn_condition = {
        max_mp: 60000,
        skill: {
            sword: 500
        }
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + lv * 2,
                mz: 20 + lv * 2,
                str: 5 + Math.floor(lv * 0.33),
                add_sh_per: 8,
            },
            parry: {
                zj: 10 + lv * 2,
                fy: Math.floor(lv * 2.31),
                fy_per: 13,
                max_hp: lv * 20,
            },
        };
    }

    pfm_set: PerformData = {
        feng: {
            name: "疯魔",
            distime: 28500,
            enable_skill: "sword",
            mp: 0,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var time = 10000;
                var mpPer = calcFengmoMpPer(lv);
                me.send_room("<red>$N仰天狂啸，双目赤红如血，$w魔气冲天，整个人陷入疯魔状态，剑势如狂风暴雨！</red>\n", target);
                me.add_status({
                    id: "fengmo",
                    name: "疯魔",
                    duration: time,
                    prop: {
                        gjsd_per: 100,
                    },
                    start_msg: "<red>$N周身魔气翻涌，剑势快如闪电，如疯如魔！</red>",
                    desc: "剑魔附体，攻速翻倍",
                });
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var mpPer = calcFengmoMpPer(lv);
                return "10秒内攻速翻倍，每次攻击附加并消耗你当前内力的" + mpPer + "%，暴击后吸取伤害恢复自身";
            },
        },
        fu: {
            name: "附魔",
            distime: 19000,
            enable_skill: "sword",
            mp: 40,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var reducePer = calcFumoReduce(lv);
                var time = calcFumoTime(lv);
                var sh = me.do_attack({
                    target: target,
                    attack_msg: "<mag>$N面容狰狞，$w上魔气凝聚如墨，带着毁天灭地的威势斩向$n！</mag>",
                    miss_msg: "<cyn>$n见$N这一剑魔威滔天，哪敢硬接，拼尽全力向旁闪去。</cyn>",
                    damage_msg: "<hir>$n被$w重重击中，魔气如跗骨之蛆侵入经脉，只觉得浑身筋骨欲裂，战力大减！</hir>",
                });
                if (sh) {
                    target.add_status({
                        id: "canque",
                        name: "残缺",
                        duration: time,
                        downside: true,
                        prop: {
                            gj_per: -reducePer,
                            mz_per: -reducePer,
                            fy_per: -reducePer,
                            ds_per: -reducePer,
                            add_sh_per: -reducePer,
                        },
                        desc: "被魔剑附魔所伤，魔力侵蚀筋骨，战斗能力大幅下降",
                    }, me);
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var reducePer = calcFumoReduce(lv);
                var time = calcFumoTime(lv);
                return "打残敌人，命中后使敌方处于残缺状态，降低战斗属性" + reducePer + "%，持续" + toSec(int(time)) + "秒。";
            },
        },
    };
}

function calcFengmoMpPer(lv: number): number {
    const m = 3 + Math.floor(lv / 200);
    if (m > 5) return 5;
    return m;
}

function calcFumoReduce(lv: number): number {
    const r = 21 + Math.floor(lv / 60);
    if (r > 30) return 30;
    return r;
}

function calcFumoTime(lv: number): number {
    const t = 8000 + Math.floor(lv * 6);
    if (t > 20000) return 20000;
    return t;
}
