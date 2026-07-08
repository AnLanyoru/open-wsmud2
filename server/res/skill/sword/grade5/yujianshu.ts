import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";
import type {LearnCondition} from "../../../../types/events.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "御剑术";
    id = "yujianshu";
    grade = 5;

    // 原始描述：蜀山立派之本，以气驭剑，人剑合一，剑气纵横三万里，一剑光寒十九洲。
    desc = "蜀山立派之本，以气驭剑，人剑合一";
    can_enables = ["sword","parry"];
    attack_actions = [
        "$N剑诀一指，$w化作一道长虹，正是「<HIC>御剑飞仙</HIC>」，凌空刺向$n的$l",
        "$N手捏剑诀，$w脱手飞出，一招「<HIG>天外飞仙</HIG>」，剑光如流光般射向$n",
        "$N周身真气鼓荡，$w一化二、二化四，正是「<HIW>万剑齐发</HIW>」，无数剑影罩向$n",
        "$N剑诀引动，$w凌空盘旋，一招「<HIC>剑气纵横</HIC>」，数道剑气交错斩向$n",
        "$N手掐法诀，$w倏忽间一分为三，正是「<HIY>三才剑阵</HIY>」，从三个方向围攻$n",
        "$N并指如剑，凌空虚画，$w随指而动，使出「<HIG>以气驭剑</HIG>」直取$n的$l",
        "$N长啸一声，$w冲天而起又骤然下击，正是「<HIC>飞剑破穹</HIC>」，剑光如流星坠地",
        "$N脚踏罡步，$w在周身环飞一圈，一招「<HIW>剑旋八荒</HIW>」，剑气如轮卷向$n"
    ];
    parry_actions = [
        "$N剑诀一引，$w回旋护体，化作一道剑幕，将$P的攻势尽数挡下",
        "$N御剑成盾，$w在身前急速旋转，正是「<HIW>剑屏护体</HIW>」，$P的攻势如泥牛入海",
        "$N以气御剑，$w以一个不可思议的角度回刺$P，迫其收招"
    ];
    learn_condition: LearnCondition = {
        max_mp: 30000,
        skill: {
            sword: 400
        }
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 15 + Math.floor(lv * 2.2),
                mz: 15 + lv * 2,
                bj_per: 5,
                add_bjsh_per: 12,
                desc: "命中敌人后积累一道剑气",
            },
            parry: {
                zj: 12 + Math.floor(lv * 2.1),
                fy: Math.floor(lv * 1.1),
                diff_bj: 5,
            },
        };
    }

    pfm_set: PerformData = {
        wan: {
            name: "万剑诀",
            distime: 18000,
            enable_skill: "sword",
            mp: 45,
            release_time: 4000,
            attack_msgs: [
                "<hic>$N剑诀一指，一道剑气破空而出，直取$n</hic>",
                "<hic>$N剑诀再引，第二道剑气紧随其后射向$n</hic>",
                "<hic>$N并指如剑，第三道剑气呼啸而出</hic>",
                "<hic>$N凌空虚画，第四道剑气纵横斩向$n</hic>",
            ],
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var self = this as PERFORM;
                var maxSwords = calcWanjianMaxSwords(lv);
                var qiCount = me.query_temp("yujian_qi", 0) || 0;
                var count = maxSwords;
                if (qiCount > 0) count = Math.min(maxSwords + qiCount, 8);
                me.set_temp("yujian_qi", 0, 0);
                me.send_room(`<hiw>$N剑诀引动，周身真气鼓荡，$w化作${count}道剑光，如流星赶月般射向$n！</hiw>\n`, target);
                for (var i = 0; i < count; i++) {
                    var bonus = Math.floor((count - i - 1) * 2);
                    me.do_attack({
                        target: target,
                        gj: me.gj + Math.floor(me.gj * bonus / 100),
                        mz: me.mz + Math.floor(me.mz * bonus / 100),
                        attack_msg: self.attack_msgs![i % self.attack_msgs!.length],
                    });
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var maxSwords = calcWanjianMaxSwords(lv);
                return "召唤" + maxSwords + "道剑气攻击当前敌人，消耗积累的剑气增加攻击次数，剩余剑气每道增加2%的伤害和命中。";
            },
        },
        tian: {
            name: "天剑诀",
            distime: 25000,
            enable_skill: "sword",
            mp: 30,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var qiCount = me.query_temp("yujian_qi", 0) || 0;
                var dmgBonus = calcTianjianDmgBonus(lv);
                var bjBonus = Math.floor(qiCount * 1.3);
                var bjshBonus = Math.floor(qiCount * 1.3);
                me.set_temp("yujian_qi", 0, 0);
                me.send_room("<hiy>$N仰天长啸，人与$w合而为一，化作一道惊天长虹，贯穿天地直击$n！</hiy>\n", target);
                var sh = me.do_attack({
                    target: target,
                    gj: Math.floor(me.gj * dmgBonus / 100),
                    mz: me.mz + Math.floor(me.mz * (qiCount * 5) / 100),
                    attack_msg: "<hiy>$N身剑合一，化作一道惊天剑虹，天地为之变色！</hiy>",
                    miss_msg: "<cyn>$n见势不妙，全力施展身法，在千钧一发之际躲过这惊天一剑。</cyn>",
                    damage_msg: "<hir>$n被剑气贯穿，只觉体内真气紊乱，经脉剧痛！</hir>",
                });
                if (sh && qiCount > 0) {
                    me.add_status({
                        id: "weapon",
                        name: "天剑",
                        duration: 5000,
                        prop: {
                            bj_per: bjBonus,
                            add_bjsh_per: bjshBonus,
                        },
                    });
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var dmgBonus = calcTianjianDmgBonus(lv);
                return "人剑合一，对敌人造成" + dmgBonus + "%攻击力的伤害，每道剑气增加1.3%暴击和暴击伤害";
            },
        },
    };
}

function calcWanjianMaxSwords(lv: number): number {
    const s = 3 + Math.floor(lv / 500);
    if (s > 4) return 4;
    return s;
}

function calcTianjianDmgBonus(lv: number): number {
    const d = 200 + Math.floor(lv / 5);
    if (d > 300) return 300;
    return d;
}
