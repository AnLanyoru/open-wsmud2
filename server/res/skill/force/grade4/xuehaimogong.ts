import { SKILL } from "../../../../core/skill/skill.js";
import type { PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER } from "../../../../core/char/character.js";
import type { LearnCondition } from "../../../../types/events.js";

export default class extends SKILL {
    name = "血海魔功";
    id = "xuehaimogong";
    grade = 4;
    force_rad = 0.75;

    desc = "血刀门的内功心法。";
    can_enables = ["force"];
    learn_condition: LearnCondition = {
        str1: 30,
        con1: 30,
    };

    slots = [
        {
            prop: "limit_mp",
            value: (lv: number) => 140 * lv,
            format: (val: number) => "内力上限：+" + val,
            query_needs: function (_lv: number) {
                return [{
                    path: "book/wudao",
                    count: 10
                }, {
                    path: "book/bc#xuehaimogong",
                    count: 25,
                }];
            },
        },
        {
            prop: 'xhmg_xj_hp',
            value: (lv: number) => 1,
            format: (val: number) => '血祭时不消耗气血',
        },
        {
            prop: 'xhmg_xj_xr',
            value: (lv: number) => 1,
            format: (val: number) => '血祭结束后将不会虚弱',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: 12 + Math.floor(lv * 1.6),
                fy: 180 + Math.floor(lv * 1.6),
                diff_fy_per: 1 + Math.floor(lv / 200),
                limit_mp: lv * 140,
                desc: "唯一：将你内力的75%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        mo: {
            name: "血魔",
            distime: 60000,
            enable_skill: "force",
            mp: 40,
            release_time: 500,
            use: function (me: CHARACTER, _target: CHARACTER, lv: number): void {
                const duration = query_xuemo_duration(lv);
                me.send_room(
                    "<hir>$N双眸赤红如血，浑身经脉贲张，一股血腥杀气冲天而起，仿佛血魔临世！</hir>\n",
                );
                me.add_status({
                    id: "force",
                    name: "血魔",
                    desc: "血魔附体，提升攻击、防御、命中、躲闪、招架",
                    duration: duration,
                    prop: {
                        gj_per: xuemo_per(lv),
                        fy_per: xuemo_per(lv),
                        mz_per: xuemo_per(lv),
                        ds_per: xuemo_per(lv),
                        zj_per: xuemo_per(lv),
                    },
                    finish_msg: "$N眼中血芒渐褪，周身那股嗜血魔气缓缓平息，归于丹田。",
                });
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const duration = query_xuemo_duration(lv);
                const per = xuemo_per(lv);
                return "血魔附体，" + (duration / 1000) + "秒内增加你" + per + "%的攻击、防御、命中、躲闪、招架";
            },
        },
        ji: {
            name: "血祭",
            distime: 60000,
            enable_skill: "force",
            mp: 56,
            release_time: 500,
            use: function (me: CHARACTER, _target: CHARACTER, lv: number): void | boolean {
                // 血祭消耗气血（基础30%，每200级减1%，最低10%；slot 进阶可免消耗）
                const noHpCost = me.query_prop("xhmg_xj_hp");
                if (!noHpCost) {
                    const hpPct = Math.max(10, 30 - Math.floor(lv / 200));
                    const hpCost = Math.floor(me.max_hp * hpPct / 100);
                    if (me.hp < hpCost) return me.notify_fail("你的气血不足，无法使用【血祭】");
                    me.add_hp(-hpCost);
                }

                const dur = xueji_dur(lv);

                me.send_room(
                    "<hir>$N咬破舌尖，一口精血喷出，全身血气暴涨，散发出令人窒息的恐怖气息！</hir>\n",
                );

                me.add_status({
                    id: "power",
                    name: "血祭",
                    desc: "血祭中，免疫死亡与控制",
                    duration: dur,
                    ig_control: true,
                    on_attach: function (p: CHARACTER): void {
                        p.add_event("on_die", si_bu_liao, dur);
                    },
                    on_expire: function (p: CHARACTER): void {
                        p.remove_event("on_die", si_bu_liao);
                        // 检查 slot：是否免虚弱
                        const noWeakness = p.query_prop("xhmg_xj_xr");
                        if (!noWeakness) {
                            p.add_status({
                                id: "xj_wk",
                                name: "虚弱",
                                desc: "血祭副作用，战斗属性大幅降低",
                                duration: dur,
                                downside: true,
                                prop: {
                                    gj_per: -30,
                                    fy_per: -30,
                                    mz_per: -30,
                                    ds_per: -30,
                                    zj_per: -30,
                                    diff_sh_per: -30,
                                },
                                finish_msg: "$N周身的血祭反噬之力渐渐消散，经脉重归通畅。",
                            }, p);
                        }
                    },
                    finish_msg: "$N周身的血芒渐渐暗淡，血祭之力消退，只余疲惫感涌上心头。",
                });
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const noHpCost = me.query_prop("xhmg_xj_hp");
                const noWeakness = me.query_prop("xhmg_xj_xr");
                const hpPct = Math.max(10, 30 - Math.floor(lv / 200));
                const dur = toSec(xueji_dur(lv));
                let desc = "血祭自身";
                if (!noHpCost) {
                    desc += "，消耗" + hpPct + "%最大气血";
                }
                desc += "，" + dur + "秒内不会死亡且免疫控制";
                if (!noWeakness) {
                    desc += "，效果结束后" + dur + "秒内自身减少30%战斗属性";
                }
                return desc;
            },
        },
    };
}


// ═══════════════════════════════════════════
// 血海魔功 — 公共计算函数
// ═══════════════════════════════════════════

/** 血魔持续时间（毫秒）：20000+lv*10，封顶30000 */
function query_xuemo_duration(lv: number): number {
    return Math.min(30000, 20000 + lv * 10);
}

/** 血魔属性百分比 */
function xuemo_per(lv: number): number {
    return 10 + Math.floor(lv / 100);
}

/** 血祭持续时间（毫秒）：4000+lv*5，封顶10000 */
function xueji_dur(lv: number): number {
    return Math.min(10000, 4000 + lv * 5);
}

function si_bu_liao(me: CHARACTER): boolean {
    me.hp = 2;
    return false;
}