import { SKILL } from "../../../../core/skill/skill.js";
import type { PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER } from "../../../../core/char/character.js";
import type { LearnCondition } from "../../../../types/events.js";

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
            value: (lv: number) => 35,
            format: (val: number) => `万法不侵期间增加伤害减免${val}%`,
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 30,
                con: Math.floor(lv * 0.338),
                fy: Math.floor(lv * 1.95),
                recover_per: 10,
                limit_mp: lv * 198,
                desc: "唯一：将你内力的85%转化为气血",
            },
        };
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
                me.notify(`<hig>你运起神农心经，金针渡穴，药气流转，恢复了${heal}点气血。</hig>`);

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
                const diffSh = snxj_wfbq_diff_sh(lv);

                me.send_room(
                    "<hic>$N抱元守一，气与意合，周身泛起一层青蒙蒙的光晕，仿佛化作一株古木，与天地融为一体。</hic>",
                );

                me.add_status({
                    id: "wfbq",
                    name: "万法不侵",
                    desc: "草木之姿融于天地，不受内力所伤，每2秒恢复气血",
                    duration: 2000,
                    duration_count: 4,
                    override: 2,
                    on_interval: function (p: CHARACTER, _over_count: number): void {
                        const hpHeal = Math.floor(p.max_hp * 6 / 100);
                        p.add_hp(hpHeal);
                        p.notify(`<hig>万法不侵之体引动草木灵气，恢复了${hpHeal}点气血。</hig>`);
                    },
                    prop: {
                        diff_sh_per: diffSh,
                    },
                    start_msg: "<hic>$N身周一时光华流转，万法不侵，诸邪辟易。</hic>",
                    finish_msg: "$N周身青光缓缓敛去，从天人合一之境中悠悠醒转。",
                });
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const diffSh = snxj_wfbq_diff_sh(lv);
                return `以草木之姿融于天地，8秒内增加伤害减免${diffSh}%，每2秒恢复6%气血。`;
            },
        },
    };
}

// ═══════════════════════════════════════════
// 神农心经 — 公共计算函数
// ═══════════════════════════════════════════

/** 金针渡穴：基础气血回复量 */
function snxj_jinzhen_heal(lv: number): number {
    return 13206;
}

/** 万法不侵：伤害减免百分比 */
function snxj_wfbq_diff_sh(lv: number): number {
    return 35;
}
