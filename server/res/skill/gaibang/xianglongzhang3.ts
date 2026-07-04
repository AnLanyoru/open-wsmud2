import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PropMap, PerformData, EnablePropMap} from "../../../core/skill/skill.js";
import type {CHARACTER, DoAttackPar} from "../../../core/char/character.js";

/**
 * 降龙十八掌无上神武 — 尝试完善的未完善技能
 *
 * 数据来源：正式服 checkskill xianglongzhang3
 */

// 共享计算函数 — 保证 query_desc 与实际效果一致性

/** 降龙：无法防御/躲闪时间 (ms) */
function qiBusyTime3(lv: number): number {
    const t = 2000 + lv * 5;
    if (t > 8000) return 8000;
    return t;
}

/** 十八掌：总释放时间 (ms) */
function shibaDuration3(lv: number): number {
    const t = 12000 - lv * 2;
    if (t < 8000) return 8000;
    return t;
}

/** 十八掌：每掌伤害递增百分比（用于乘法因子） */
function shibaFactor3(lv: number): number {
    const f = 105 + Math.floor(lv / 500);
    if (f > 115) return 115;
    return f;
}

export default class extends SKILL {
    name = "降龙十八掌";
    id = "xianglongzhang3";
    grade = 6;
    is_hidden = true;
    family = FAMILIES.GAIBANG;
    desc = "丐帮的降龙十八掌，至刚至猛，威震天下";
    can_enables = ["unarmed", "parry"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];

    slots = [
        {
            prop: "xlz3_sb",
            value: (lv: number) => 15,
            format: (val: number) => "十八掌伤害递增额外增加" + val + "%",
        },
    ];

    query_prop(lv: number, me?: CHARACTER): PropMap {
        return {
            gj_per: 5 + Math.floor(lv / 300),
        };
    }

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 5 + lv * 3,
                fy: 5 + lv * 3,
                mz: 20 + lv * 3,
                str: 3 + Math.floor(lv * 0.5),
            },
            parry: {
                zj: 5 + lv * 3,
                fy: 100 + lv * 3,
                diff_sh_per: 1 + Math.floor(lv / 300),
            },
        };
    }

    pfm_set: PerformData = {
        qi: {
            name: "降龙",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 30,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                let isParried = false;
                const sh = me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    no_weapon: true,
                    attack_msg: "<hiy>$N丹田中真气鼓荡，双掌一错，将降龙十八掌的至刚劲力催至十二成，双掌齐推，一道狂猛无俦的掌劲如怒龙出海，轰然击向$n！</hiy>",
                    damage_msg: "<hir>只听「轰」的一声巨响，$N掌力已结结实实打在$n身上，劲力如山洪暴发，$n踉跄后退，脚下石板寸寸碎裂！</hir>",
                    on_parry: function (t: CHARACTER, ispa: boolean): boolean {
                        isParried = ispa;
                        if (ispa) {
                            (this as DoAttackPar).damage_msg = "<hir>$n奋起全力招架，却觉$N掌力刚猛无匹，如泰山压顶般不可抵挡，双臂酸麻欲折，喉头一甜，鲜血夺口而出。</hir>";
                        }
                        return false;
                    },
                    miss_msg: "<hic>$n见$N掌力来势凶猛，不敢硬接，足踏八卦，身形如游鱼般连闪数闪，堪堪避过了这惊天动地的一掌。</hic>",
                });
                if (sh && !isParried) {
                    const busyTime = qiBusyTime3(lv);
                    target.add_status({
                        id: "unarmed",
                        duration: busyTime,
                        name: "降龙掌劲",
                        downside: true,
                        is_busy: true,
                        is_rash: true,
                        desc: "被降龙掌劲镇住，浑身僵硬，无法防御与躲闪。",
                    }, me);
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const t = qiBusyTime3(lv);
                return "以强劲的掌力猛击敌人，如果敌人招架失败，将在" + toSec(t) + "秒无法防御，躲闪。";
            },
        },
        shiba: {
            name: "十八掌",
            distime: 25000,
            enable_skill: "unarmed",
            mp: 30,
            release_time: 4000,
            msgs: [
                "<hig>———— 亢龙有悔 ————</hig>\n$N左腿微屈，右臂内弯，右掌划了个圆圈，呼的一声向外推去，正是降龙十八掌的起手式「亢龙有悔」",
                "<hig>———— 飞龙在天 ————</hig>\n$N忽然身形纵起，跃至半空，双掌居高临下一招「飞龙在天」，如苍鹰搏兔般拍向$n的$l",
                "<hig>———— 见龙在田 ————</hig>\n$N转攻为守，纯用防御，右掌一招「见龙在田」，迅捷无比地劈向$n的$l",
                "<hic>———— 鸿渐于陆 ————</hic>\n$N双掌施出一招「鸿渐于陆」，掌力吞吐不定，隐隐带着风雷之声拍向$n的$l",
                "<hic>———— 潜龙勿用 ————</hic>\n$N左掌聚成拳状，右掌一招「潜龙勿用」，劲力含而不发，缓缓推向$n的$l",
                "<hic>———— 利涉大川 ————</hic>\n$N施出一招「利涉大川」，右掌插腰蓄力，左掌势如破竹劈向$n的$l",
                "<hiy>———— 突如其来 ————</hiy>\n$N使出「突如其来」，右掌从一个绝不可能的角度疾推而出，直取$n的$l",
                "<hiy>———— 震惊百里 ————</hiy>\n$N蓦地一声大喝，双掌使出「震惊百里」，劲力如狂涛骇浪，不顾一切般击向$n",
                "<hiy>———— 或跃在渊 ————</hiy>\n$N使出一招「或跃在渊」，身随掌走，向$n的$l连环拍出数掌",
                "<hiz>———— 双龙取水 ————</hiz>\n$N身形疾转，双掌一前一后，一招「双龙取水」按向$n的$l",
                "<hiz>———— 鱼跃于渊 ————</hiz>\n$N使出「鱼跃于渊」，身形飞起，双掌合并如刀向$n的$l直劈而下",
                "<hiz>———— 时乘六龙 ————</hiz>\n$N双掌一立，使出「时乘六龙」，掌影纷飞间向$n连砍六下",
                "<hio>———— 密云不雨 ————</hio>\n$N使出「密云不雨」，左掌封住$n退路，右掌如乌云压顶斜劈$l",
                "<hio>———— 损则有孚 ————</hio>\n$N使出「损则有孚」，双掌看似软绵绵不着力，实则暗流汹涌，拍向$n的$l",
                "<hio>———— 龙战于野 ————</hio>\n$N脚下一转，身形忽东忽西，一招「龙战于野」欺近$n身前，拍向$n的$l",
                "<hir>———— 履霜冰至 ————</hir>\n$N门户大开，竟然不守不防，一招「履霜冰至」和身扑向$n的$l",
                "<hir>———— 羝羊触蕃 ————</hir>\n$N嗔目大喝，一招「羝羊触蕃」双掌由下往上，势如奔雷击向$n的$l",
                "<hir>———— 神龙摆尾 ————</hir>\n$N左掌护胸，右掌使出最后一式「神龙摆尾」，掌影晃动间暗藏杀机，直击$n的$l",
            ],
            query_releasetime: function (me: CHARACTER, lv: number): number {
                const skLv = lv || me.query_skill("xianglongzhang3", 0);
                const t = 12000 - skLv * 2;
                if (t < 8000) return 8000;
                return t;
            },
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const totalTime = shibaDuration3(lv);
                const perTime = Math.floor(totalTime / 18);
                const factor = shibaFactor3(lv);
                const mzPer = 5 + Math.floor(lv / 500);
                const slotExtra = me.query_prop("xlz3_sb");
                const enhancedFactor = Math.min(115, factor + slotExtra);
                let gj = me.gj;
                const self = this as PERFORM;

                me.is_rash = totalTime;
                me.send_room("<hiy>$N凝神聚气，双目微阖，双掌在胸前缓缓划弧，将降龙十八掌的十八般变化融会于心。蓦地双眼一睁，精光四射，双掌悍然推出！</hiy>\n", target);

                let mzLayer = 0;
                me.call_interval(
                    function (i: number): boolean | void {
                        const nowTarget = me.query_enemy();
                        if (!nowTarget) {
                            me.is_rash = 0;
                            return false;
                        }
                        if (mzLayer < 18) {
                            mzLayer++;
                            me.add_status({
                                id: "xlz3_mz",
                                name: "掌意",
                                duration: totalTime,
                                override: 1,
                                count: mzLayer,
                                max_count: 18,
                                prop: {
                                    mz_per: mzPer,
                                },
                            }, me);
                        }
                        if (me.do_attack({
                            target: nowTarget,
                            gj: gj,
                            mz: me.mz,
                            attack_msg: self.msgs![i],
                            no_weapon: true,
                        })) {
                            gj = Math.floor(gj * enhancedFactor / 100);
                        }
                        me.end_attack(nowTarget);
                        if (!me.enemy?.length) {
                            me.is_rash = 0;
                            return false;
                        }
                        if (i >= 17) me.is_rash = 0;
                    },
                    perTime,
                    18,
                );
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const duration = shibaDuration3(lv);
                const pct = shibaFactor3(lv) - 100;
                return toSec(duration) + "秒内将十八掌全部打出，掌力会越来越凶猛，每命中一掌增加伤害" + pct + "%，不论是否命中，命中都增加" + pct + "%，攻击中无法躲闪（对NPC伤害递增减半，释放速度加快）。";
            },
        },
    };
}
