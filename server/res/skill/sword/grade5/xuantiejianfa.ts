import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "玄铁剑法";
    id = "xuantiejianfa";
    grade = 5;

    // 原始描述：玄铁剑法，重剑无锋，大巧不工，越是平平无奇的剑招，对方越难抗御。如挺剑直刺，只要劲力强猛，威力远比变幻奇妙的剑招威力更大。
    desc = "玄铁剑法，重剑无锋，大巧不工，越是平平无奇的剑招，对方越难抗御。如挺剑直刺，只要劲力强猛，威力远比变幻奇妙的剑招威力更大";
    can_enables = ["sword","parry"];
    attack_actions = [
        "$N$w缓缓举起，看似笨拙的一招「<HIY>重剑无锋</HIY>」，却带着万钧之势劈向$n的$l",
        "$N$w平平刺出，毫无花巧，正是「<HIG>大巧不工</HIG>」，但剑气如山压向$n",
        "$N单臂持剑，一招「<HIC>举重若轻</HIC>」，$w看似轻飘飘地挥洒而出，劲力却如怒涛般涌向$n",
        "$N$w横扫而出，一招「<HIW>横扫千军</HIW>」，剑气如狂潮席卷，$n只觉得呼吸困难",
        "$N深吸一口气，$w当头劈下，正是「<HIY>力劈华山</HIY>」，刚猛无匹的剑气直斩$n的$l",
        "$N$w一抖，看似简单的直刺，却蕴含着「<HIG>返璞归真</HIG>」的剑意",
        "$N$w缓缓画了个半圆，一招「<HIC>沧海横流</HIC>」，剑势如山崩海啸般压向$n",
        "$N双手握剑，纵身跃起，一招「<HIW>泰山压顶</HIW>」，以雷霆万钧之势劈向$n"
    ];
    parry_actions = [
        "$n$w横举，以厚重的剑身硬接$P的攻势，玄铁重剑稳如泰山，纹丝不动",
        "$n$w一转，以剑脊迎向$P的攻击，正是「<HIY>铁壁铜墙</HIY>」，将$P的劲力尽数化解",
        "$n$w缓缓画弧，以拙破巧，$P只觉得剑招如泥牛入海，力道全被化去",
        "$n不退反进，$w带着沉重的破空声迎向$P的兵器，以硬碰硬"
    ];
    learn_condition = {
        max_mp: 30000,
        skill: {
            sword: 400
        }
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + lv * 2,
                mz: 20 + lv * 2,
                str: 5 + Math.floor(lv * 0.33),
                diff_fy_per: 8,
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
        chao: {
            name: "海潮汹涌",
            distime: 30000,
            enable_skill: "sword",
            mp: 0,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var count = calcHaichaoCount(lv);
                var mpPer = calcHaichaoMpPer(lv);
                me.send_room("<hib>$N手中$w挥洒，剑势如海潮汹涌，一浪高过一浪，层层叠叠向$n席卷而去！</hib>\n", target);
                for (var i = 0; i < count; i++) {
                    var mpCost = Math.floor(me.mp * mpPer / 100);
                    if (mpCost < 0) mpCost = 0;
                    me.do_attack({
                        target: target,
                        gj: me.gj + mpCost,
                        attack_msg: "<hib>$N剑势如潮，劲力一重接一重涌向$n</hib>",
                    });
                    if (mpCost > 0) {
                        me.add_mp(-mpCost);
                    }
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var count = calcHaichaoCount(lv);
                var mpPer = calcHaichaoMpPer(lv);
                return "快速对附近敌人攻击" + count + "次，每次攻击附加并消耗你当前内力的" + mpPer + "%";
            },
        },
        zhong: {
            name: "重剑无锋",
            distime: 30000,
            enable_skill: "sword",
            mp: 40,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var reducePer = calcZhongjianReduce(lv);
                var time = calcZhongjianTime(lv);
                var sh = me.do_attack({
                    target: target,
                    attack_msg: "<hiy>$N双手握剑，$w平平举起，缓缓向$n推去，剑势沉重如山，看似缓慢却避无可避！</hiy>",
                    miss_msg: "<cyn>$n见$N剑势沉重，不敢硬接，全力向旁闪避。</cyn>",
                    damage_msg: "<hir>$w重重砸在$n身上，只听得骨骼格格作响，$n如遭重锤轰击！</hir>",
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
                            gjsd_per: -reducePer,
                        },
                        desc: "被重剑所伤，筋骨受损，战斗能力大幅下降",
                    }, me);
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var reducePer = calcZhongjianReduce(lv);
                var time = calcZhongjianTime(lv);
                return "重剑打击敌人，命中后使敌方处于残缺状态，降低战斗属性" + reducePer + "%，攻击速度" + reducePer + "%";
            },
        },
    };
}

function calcHaichaoCount(lv: number): number {
    const c = 3 + Math.floor(lv / 200);
    if (c > 8) return 8;
    return c;
}

function calcHaichaoMpPer(lv: number): number {
    const m = 3 + Math.floor(lv / 200);
    if (m > 5) return 5;
    return m;
}

function calcZhongjianReduce(lv: number): number {
    const r = 11 + Math.floor(lv / 60);
    if (r > 20) return 20;
    return r;
}

function calcZhongjianTime(lv: number): number {
    const t = 8000 + Math.floor(lv * 8);
    if (t > 20000) return 20000;
    return t;
}
