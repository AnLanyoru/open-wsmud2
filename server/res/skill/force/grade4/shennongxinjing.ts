import { SKILL } from "../../../../core/skill/skill.js";
import type { PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";
import type { LearnCondition } from "../../../../types/events.js";
import { PropMap } from "../../../../types/props.js";

export default class extends SKILL {
    name = "神农心经";
    id = "shennongxinjing";
    grade = 4;
    force_rad = 0.85;

    desc = "药王谷内功，传自神农尝百草之术，既能固本培元，亦能御毒抗邪。";
    can_enables = ["force"];

    learn_condition: LearnCondition = {
        skill: {
            force: 300,
        },
        con: 30,
    };

    slots = [
        {
            prop: 'snxj_jz_qc',
            value: (lv: number) => 1,
            format: (_val: number) => '金针渡穴清理自身的全部异常状态',
        },
        {
            prop: 'snxj_wf_ms',
            value: (lv: number) => 30 + int(lv / 200),
            format: (val: number) => `万法不侵期间增加伤害减免${val}%`,
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 30,
                con: Math.floor(lv * 0.338),
                fy: 150 + Math.floor(lv * 1.8),
                recover_per: 5 + Math.floor(lv / 200),
                limit_mp: lv * 198,
                desc: "唯一：将你内力的85%转化为气血",
            },
        };
    }

    /**
     * 万法不侵：免疫内力伤害
     */
    on_force_parry(_target: CHARACTER, me: CHARACTER, sh: number, _par: DoAttackPar): number {
        if (me.query_temp("wfbq_active", 0) > 0) {
            return 0;
        }
        return sh;
    }

    pfm_set: PerformData = {
        jinzhen: {
            name: "金针渡穴",
            distime: 15000,
            enable_skill: "force",
            mp: 60,
            release_time: 1500,
            use: function (me: CHARACTER, _target: CHARACTER, lv: number): void {
                const heal = snxj_jinzhen_heal(lv);
                const clearAll = me.query_prop("snxj_jz_qc") > 0;

                me.send_room(
                    "<hig>$N指尖银芒一闪，数根金针已刺入自身要穴，真气循经而行，百骸俱暖。</hig>",
                );

                me.add_hp(heal);

                if (clearAll) {
                    const count = me.clear_downside(true);
                    if (count > 0) {
                        me.notify(`<hig>金针渡穴，药力通达四肢百骸，${count}种异状尽数化解。</hig>`);
                    }
                } else {
                    if (me.status) {
                        for (const s of me.status) {
                            if (s.downside && !s.no_clear) {
                                me.remove_status(s.id);
                                me.notify(`<hig>金针渡穴，药力所至，1种异状应声而解。</hig>`);
                                break;
                            }
                        }
                    }
                }
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const heal = snxj_jinzhen_heal(lv);
                const clearAll = me.query_prop("snxj_jz_qc") > 0;
                return `消耗内力以金针刺激穴位，为自己恢复${heal}点气血，清理${clearAll ? '全部' : '1个'}异常状态。`;
            },
        },
        wanfabuqin: {
            name: "万法不侵",
            distime: 60000,
            enable_skill: "force",
            mp: 150,
            release_time: 2000,
            use: function (me: CHARACTER, _target: CHARACTER, lv: number): void {
                const diffSh = me.query_prop("snxj_wf_ms");
                const total = wfbq_total_dur(lv);
                const interval = wfbq_interval(lv);
                const count = Math.round(total / interval);
                const regenPct = wfbq_regen_pct(lv);

                me.send_room(
                    "<hic>$N抱元守一，气与意合，周身泛起一层青蒙蒙的光晕，仿佛化作一株古木，与天地融为一体。</hic>",
                );

                const prop: PropMap = {}
                if (diffSh) prop.diff_sh_per = diffSh;
                me.add_status({
                    id: "force",
                    name: "不侵",
                    desc: "草木之姿融于天地，不受内力所伤",
                    duration: interval,
                    duration_count: count,
                    override: 2,
                    on_attach: function (p: CHARACTER): void {
                        p.set_temp("wfbq_active", 1, interval * count);
                    },
                    on_expire: function (p: CHARACTER): void {
                        p.remove_temp("wfbq_active");
                    },
                    on_interval: function (p: CHARACTER, _over_count: number): void {
                        const hpHeal = int(p.max_hp * regenPct / 100);
                        p.add_hp(hpHeal);
                        p.notify(`<hig>万法不侵之体引动草木灵气，恢复了${hpHeal}点气血。</hig>`);
                    },
                    prop,
                    start_msg: "<hic>$N身周一时光华流转，万法不侵，诸邪辟易。</hic>",
                    finish_msg: "$N周身青光缓缓敛去，从天人合一之境中悠悠醒转。",
                });
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const diffSh = snxj_wfbq_diff_sh(lv);
                const total = wfbq_total_dur(lv);
                const interval = wfbq_interval(lv);
                const regenPct = wfbq_regen_pct(lv);
                return `以草木之姿融于天地，${(total / 1000).toFixed(1)}秒内增加伤害减免${diffSh}%，每${interval / 1000}秒恢复${regenPct}%气血。`;
            },
        },
    };
}

// ═══════════════════════════════════════════
// 神农心经 — 公共计算函数
// ═══════════════════════════════════════════

/** 金针渡穴：基础气血回复量 */
function snxj_jinzhen_heal(lv: number): number {
    return 20 + Math.floor(lv * 34 / 1000);
}

/** 万法不侵：伤害减免百分比 */
function snxj_wfbq_diff_sh(lv: number): number {
    return 35;
}

/** 万法不侵总持续时间（毫秒）：8000+lv */
function wfbq_total_dur(lv: number): number {
    return 8000 + lv;
}

/** 万法不侵触发间隔（毫秒）：lv<5000时为2000，lv≥5000时为3000 */
function wfbq_interval(lv: number): number {
    return 2000 + Math.floor(lv / 5000) * 1000;
}

/** 万法不侵每次恢复气血百分比：5+floor(lv/1000) */
function wfbq_regen_pct(lv: number): number {
    return 5 + Math.floor(lv / 1000);
}
