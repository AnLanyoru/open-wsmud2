import { SKILL } from "../../../../core/skill/skill.js";
import type { PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { LearnCondition } from "../../../../types/events.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";
import { PropMap } from "../../../../types/props.js";

export default class extends SKILL {
    name = "化功大法";
    id = "huagongdafa";
    grade = 4;
    force_rad = 0.75;

    desc = "星宿派掌门丁春秋从北冥神功演化而来的内功，功法霸道专门化去别人内力。";
    can_enables = ["force"];
    learn_condition: LearnCondition = {
        max_mp: 15000,
        skill: {
            force: 200,
        },
    };
    slots = [
        {
            prop: "limit_mp",
            value: (lv: number) => 130 * lv,
            format: (val: number) => "内力上限：+" + val,
            query_needs: function (_lv: number) {
                return [{
                    path: "book/wudao",
                    count: 10
                }, {
                    path: "book/bc#huagongdafa",
                    count: 25,
                }];
            },
        },
        {
            prop: "hgd_xn_cd",
            value: (lv: number) => 4000,
            format: (val: number) => "吸取内力的冷却减少" + toSec(val) + "秒",
        },
        {
            prop: "hgd_hd_xy",
            value: (lv: number) => 5 + int(lv / 100),
            format: (val: number) => "化毒的增益效果变为增加自身最终伤害和防御减免" + val + "%",
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                fy: Math.floor(lv * 1.5) + 10,
                gj: Math.floor(lv * 1.5) + 10,
                limit_mp: lv * 155,
                desc: "当你命中敌人后会吸取对方内力增加自身最大内力\n唯一：将你内力的75%转化为气血",
            },
        };
    }

    /**
     * 化毒状态 -> 被攻击时减少攻击者内力（参考北冥机制）
     */
    on_damage(me: CHARACTER, sh: number, from?: CHARACTER): number {
        if (me.query_temp("hgd_hd", 0) > 0 && from && from.hp > 0) {
            const lv = me.query_skill("huagongdafa", 0);
            const mpDrain = hd_mp_drain(lv);
            from.add_mp(-mpDrain);
            me.send_room(
                "<hib>$N周身碧色毒罡如蛇缠身，内力竟被化毒吞去三分！</hib>\n",
                from,
            );
        }
        return sh;
    }

    /**
     * 化功状态 -> 攻击命中时吸收目标内力并附加 debuff（参考北冥机制）
     */
    on_attack_over(me: CHARACTER, target: CHARACTER, _par: DoAttackPar, sh: number): void {
        if (sh <= 0) return;
        if (!target || target.hp <= 0) return;
        if (me.max_mp < me.limit_mp + me.query_prop("limit_mp")) {
            let cd = 4000 - me.query_prop("hgd_xn_cd");
            if (cd < 500) cd = 500;
            if (!me.query_temp("sk_huagong_xn", 0)) {
                me.set_temp("sk_huagong_xn", 1, cd);
                const lv = me.query_skill("huagongdafa", 0);
                const gj = Math.round(lv / 10);
                const mp = Math.floor(gj * 120 / 100);
                if (target.mp > mp) {
                    target.add_mp(-mp);
                    me.max_mp += gj;
                    me.send_room(
                        "<hib>$N掌中碧毒顺势侵入$n经脉，$p内力如江河决堤般被化去！</hib>\n",
                        target,
                    );
                }
            }

        }

        // 化功状态 -> 给目标附加攻命降低的 debuff
        if (me.query_temp("hgd_hg", 0) > 0) {
            const lv = me.query_skill("huagongdafa", 0);
            target.add_status({
                id: "hg",
                name: "化功",
                desc: "化功大法毒气侵蚀，攻击与命中大幅下降",
                duration: hg_debuff_dur(lv),
                override: 2,
                downside: true,
                no_diff: true,
                prop: {
                    gj_per: -hg_debuff_per(lv),
                    mz_per: -hg_debuff_per(lv),
                },
            }, me);
        }
    }

    pfm_set: PerformData = {
        huadu: {
            name: "化毒",
            distime: 30000,
            enable_skill: "force",
            mp: 0,
            release_time: 500,
            use: function (me: CHARACTER, _target: CHARACTER, lv: number): void {
                const dur = hd_dur(lv);
                const gjAdd = hd_gj_add(lv);
                const fyAdd = hd_fy_add(lv);
                const slotBonus = me.query_prop("hgd_hd_xy");

                let prop: PropMap = {
                    gj: gjAdd,
                    fy: fyAdd,
                }
                if (slotBonus) {
                    prop = {
                        diff_sh_per: slotBonus,
                        diff_fy_per: slotBonus,
                    }
                }

                me.send_room(
                    "<hib>$N深吸一口气，双掌翻飞间周身碧光大盛，毒雾缭绕，竟是运起化功大法以身为炉、以内力化毒！</hib>\n",
                );

                me.add_status({
                    id: "force",
                    name: "化毒",
                    desc: "内力化毒布满全身，提升攻击与防御",
                    duration: dur,
                    prop,
                    on_attach: function (p: CHARACTER): void {
                        p.set_temp("hgd_hd", 1, dur);
                    },
                    on_expire: function (p: CHARACTER): void {
                        p.remove_temp("hgd_hd");
                    },
                    finish_msg: "$N周身碧色毒雾渐渐消散，化毒之功收归丹田。",
                });
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const dur = hd_dur_str(lv);
                const gj = hd_gj_add(lv);
                const fy = hd_fy_add(lv);
                const mp = hd_mp_drain(lv);
                return "在" + dur + "秒内内力化毒布满自身，增加自身" + gj + "点攻击和" + fy + "点防御，被敌人击中后会减少敌方" + mp + "点内力";
            },
        },
        huagong: {
            name: "化功",
            distime: 20000,
            enable_skill: "force",
            mp: 0,
            release_time: 500,
            use: function (me: CHARACTER, _target: CHARACTER, lv: number): void {
                const dur = hg_dur(lv);

                me.send_room(
                    "<hiy>$N双掌猛然向天一举，浑身上下碧焰冲天，毒气如潮水般向四外席卷而出！四周草木瞬间枯黄凋零！</hiy>\n",
                );

                me.add_status({
                    id: "force",
                    name: "化功",
                    desc: "内力化毒布满四周，攻击命中敌人可令其功力大减",
                    duration: dur,
                    on_attach: function (p: CHARACTER): void {
                        p.set_temp("hgd_hg", 1);
                    },
                    on_expire: function (p: CHARACTER): void {
                        p.remove_temp("hgd_hg");
                    },
                    finish_msg: "$N周身汹涌的碧焰毒气缓缓收敛，化功之势已消。",
                });
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const dur = hg_dur_str(lv);
                const per = hg_debuff_per(lv);
                const debuffDur = toSec(hg_debuff_dur(lv));
                return "在" + dur + "秒内内力化毒布满四周，攻击命中敌人可降低其" + per + "%的攻击和命中，持续" + debuffDur + "秒";
            },
        },
    };
}

// ═══════════════════════════════════════════
// 化功大法 — 公共计算函数
// ═══════════════════════════════════════════

/** 化毒持续时间（毫秒） */
function hd_dur(lv: number): number {
    return 3000 + lv * 3;
}

/** 化毒持续时间显示（秒） */
function hd_dur_str(lv: number): string {
    return toSec(hd_dur(lv));
}

/** 化毒攻击加成 */
function hd_gj_add(lv: number): number {
    return Math.floor(lv * 1.5);
}

/** 化毒防御加成 */
function hd_fy_add(lv: number): number {
    return Math.floor(lv * 1.5);
}

/** 化毒减少敌方内力量 */
function hd_mp_drain(lv: number): number {
    return 5000 + lv * 2 + Math.floor(lv * lv / 300);
}

/** 化功持续时间（毫秒） */
function hg_dur(lv: number): number {
    return 5000 + lv * 5;
}

/** 化功持续时间显示（秒） */
function hg_dur_str(lv: number): string {
    return toSec(hg_dur(lv));
}

/** 化功 debuff 持续时间（毫秒） */
function hg_debuff_dur(lv: number): number {
    return 5000 + lv * 5;
}

/** 化功 debuff 百分比 */
function hg_debuff_per(lv: number): number {
    return 15 + Math.floor(lv / 200);
}
