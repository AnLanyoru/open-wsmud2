import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap} from "../../../core/skill/skill.js";
import type {CHARACTER, DoAttackPar} from "../../../core/char/character.js";
import type {PropMap} from "../../../types/props.js";

/**
 * 降龙十八掌进阶 — 完善度90
 *
 * 数据来源：正式服 checkskill xianglongzhang2
 */
export default class extends SKILL {
    name = "降龙十八掌";
    id = "xianglongzhang2";
    source_skill = "xianglongzhang";
    grade = 5;
    family = FAMILIES.GAIBANG;
    desc = "丐帮的降龙十八掌，至刚至猛，威震天下";
    can_enables = ["unarmed", "parry"];
    attack_actions = SKILL.get("xianglongzhang")?.attack_actions || [];

    slots = [
        {
            prop: "xlz_sb",
            value: (lv: number) => 10,
            format: (val: number) => "十八掌每次攻击附加" + val + "%伤害递增",
        },
    ];

    query_prop(lv: number, me?: CHARACTER): PropMap {
        return {
            gj_per: 5 + int(lv / 300),
        };
    }

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 5 + lv * 2,
                fy: 5 + lv * 2,
                mz: 20 + lv * 2,
                str: 3 + int(lv * 0.25),
            },
            parry: {
                zj: 5 + lv * 2,
                fy: 100 + lv * 2,
                diff_sh_per: 1 + int(lv / 300),
            },
        };
    }

    pfm_set: PerformData = {
        qi: {
            name: "降龙",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 30,
            release_time: 500,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                let isParried = false;
                const sh = me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    no_weapon: true,
                    attack_msg: "<hiy>$N气沉丹田，双臂一振，将降龙十八掌的刚猛劲力聚于双掌之间，猛地一掌推出，掌风呼啸如龙吟，直贯$n胸膛！</hiy>",
                    damage_msg: "<hir>只听「砰」的一声闷响，$N浑厚掌力已结结实实印在$n胸口，劲力透体而过！</hir>",
                    on_parry: function (t: CHARACTER, ispa: boolean): boolean {
                        isParried = ispa;
                        if (ispa) {
                            (this as DoAttackPar).damage_msg = "<hir>$n奋力一架，却觉$N掌力如排山倒海般涌来，虎口剧震，胸中气血翻腾不止。</hir>";
                        }
                        return false;
                    },
                    miss_msg: "<hic>$n大惊之下，双掌连划三个半圆护住身前，足尖点地飘身急退，堪堪避开了$N这势大力沉的一掌。</hic>",
                });
                if (sh && !isParried) {
                    const busyTime = qiBusyTime(lv);
                    target.add_status({
                        id: "xlz",
                        duration: busyTime,
                        name: "降龙",
                        downside: true,
                        desc: "被降龙掌劲所镇，浑身酸麻，无法防御。",
                    }, me);
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const t = qiBusyTime(lv);
                return "以强劲的掌力猛击敌人，如果敌人招架失败，将在" + toSec(t) + "秒无法防御。";
            },
        },
        shiba: {
            name: "十八掌",
            distime: 25000,
            enable_skill: "unarmed",
            mp: 30,
            release_time: 4179,
            msgs: [
                "<hig>-----亢龙有悔-----</hig>\n$N双掌平平提到胸前，神色沉重的缓缓施出「亢龙有悔」推向$n",
                "<hig>-----飞龙在天-----</hig>\n$N突然身形飞起，双掌居高临下一招「飞龙在天」拍向$n的$l",
                "<hig>-----见龙在田-----</hig>\n$N右掌一招「见龙在田」，迅捷无比地劈向$n的$l",
                "<hic>-----鸿渐于陆-----</hic>\n$N双掌施出一招「鸿渐于陆」，隐隐带着风声拍向$n的$l",
                "<hic>-----潜龙勿用-----</hic>\n$N左掌聚成拳状，右掌一招「潜龙勿用」缓缓推向$n的$l",
                "<hic>-----利涉大川-----</hic>\n$N施出一招「利涉大川」，右掌插腰，左掌劈向$n的$l",
                "<hiy>-----突如其来-----</hiy>\n$N使出「突如其来」，右掌从不可能的角度向$n的$l推出",
                "<hiy>-----震惊百里-----</hiy>\n$N大吼一声，双掌使出「震惊百里」，不顾一切般击向$n",
                "<hiy>-----或跃在渊-----</hiy>\n$N使出降龙十八掌之「或跃在渊」，向$n的$l连续拍出数掌",
                "<hiz>-----双龙取水-----</hiz>\n$N身形滑动，双掌使一招「双龙取水」一前一后按向$n的$l",
                "<hiz>-----鱼跃于渊-----</hiz>\n$N使出「鱼跃于渊」，身形飞起，双掌并在一起向$n的$l劈下",
                "<hiz>-----时乘六龙-----</hiz>\n$N双掌立起，使出降龙十八掌中的「时乘六龙」向$n连砍六下",
                "<hio>-----密云不雨-----</hio>\n$N使出「密云不雨」，左掌封住$n的退路，右掌斜斜地劈向$l",
                "<hio>-----损则有孚-----</hio>\n$N使出降龙十八掌一势「损则有孚」，双掌软绵绵地拍向$n的$l",
                "<hio>-----龙战于野-----</hio>\n$N脚下一转，突然欺到$n身前，一招「龙战于野」拍向$n的$l",
                "<hir>-----履霜冰至-----</hir>\n却见$N门户大开，蓦地施出一招「履霜冰至」向$n的$l劈去",
                "<hir>-----羝羊触蕃-----</hir>\n$N嗔目大喝，使出「羝羊触蕃」，双掌由下往上击向$n的$l",
                "<hir>-----神龙摆尾-----</hir>\n$N左掌护胸，右掌使一招「神龙摆尾」上下晃动着击向$n的$l"
            ],
            query_releasetime: function (me: CHARACTER, lv: number): number {
                const skLv = lv || me.query_skill("xianglongzhang2", 0);
                const t = 12000 - skLv * 2;
                if (t < 8000) return 8000;
                return t;
            },
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const totalTime = shibaDuration(lv);
                const perTime = int(totalTime / 18);
                const factor = shibaFactor(lv);
                let gj = me.gj;
                let mz = me.mz;
                const mzFactor = 100 + (shibaFactor(lv) - 100); // 与伤害同比例递增
                const self = this as PERFORM;

                me.is_rash = totalTime;
                me.send_room("<hiy>$N凝神聚气，神态淡然，左手虚划，右手回转，聚气于胸前，双掌猛地推出，蕴含着降龙十八掌的十八般变化<hiy>\n");

                me.call_interval(
                    function (i: number): boolean | void {
                        const nowTarget = me.query_enemy();
                        if (!nowTarget) {
                            me.is_rash = 0;
                            return false;
                        }
                        // 不论命中与否，每击后掌意愈浓，命中递增
                        // 对身中降龙掌劲者，掌力直透防御
                        const hasXlz = nowTarget.query_status("xlz") > 0;
                        const hit = me.do_attack({
                            target: nowTarget,
                            gj: gj,
                            mz: mz,
                            attack_msg: self.msgs![i],
                            no_weapon: true,
                            diff_fy: hasXlz ? 100 : 0,
                            no_dodge: hasXlz ? true : false,
                            no_parry: hasXlz ? true : false,
                        });
                        if (hit) {
                            // 命中后掌力递增
                            gj = int(gj * factor / 100);
                        }
                        // 每击命中递增（不论命中与否）
                        mz = int(mz * mzFactor / 100);
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
                const duration = shibaDuration(lv);
                const pct = shibaFactor(lv) - 100;
                return toSec(duration) + "秒内将十八掌全部打出，掌力会越来越凶猛，每命中一掌增加伤害" + pct + "%，不论是否命中，命中都增加" + pct + "%，攻击中无法躲闪（对NPC伤害递增减半，释放速度加快）。";
            },
        },
    };
}

// 共享计算函数 — 保证 query_desc 与实际效果一致性

/** 降龙：无法防御时间 (ms) */
function qiBusyTime(lv: number): number {
    const t = 2000 + lv * 5;
    if (t > 8000) return 8000;
    return t;
}

/** 十八掌：总释放时间 (ms) */
function shibaDuration(lv: number): number {
    const t = 12000 - lv * 2;
    if (t < 8000) return 8000;
    return t;
}

/** 十八掌：每掌伤害递增百分比（用于乘法因子） */
function shibaFactor(lv: number): number {
    const f = 105 + int(lv / 500);
    if (f > 115) return 115;
    return f;
}
