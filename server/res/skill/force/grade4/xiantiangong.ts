import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "先天功";
    id = "xiantiangong";
    grade = 4;
    force_rad = 0.82;

    desc = "由重阳真人所创的一门道家绝妙武功，至刚至阳";
    can_enables = ["force"];
    slots = [
        {
            prop: 'xtg_nl_max',
            value: (_lv: number) => 110,
            format: (val: number) => '内力上限：+110000',
        },
        {
            prop: 'xtg_dyq_nl',
            value: (_lv: number) => 1,
            format: (val: number) => '定阳气会同步恢复内力',
        },
        {
            prop: 'xtg_cyq_fz',
            value: (_lv: number) => 40,
            format: (val: number) => '纯阳气期间对敌人造成40%防御力的反震伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: lv * 2,
                hp_per: 8,
                fy_per: 8,
                limit_mp: lv * 190,
                desc: "唯一：将你内力的82%转化为气血",
            },
        };
    }

    /**
     * 纯阳气——每击附加最大内力1%的伤害。
     */
    on_attack(me: CHARACTER, _target: CHARACTER, _par: DoAttackPar): number {
        if (me.query_temp("xtg_cy", 0)) {
            return Math.floor(me.max_mp * 0.01);
        }
        return 0;
    }

    pfm_set: PerformData = {
        chunyang: {
            name: "纯阳气",
            distime: 30000,
            enable_skill: "force",
            mp: 45,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = query_xtg_chunyang_duration(lv);
                me.send_room(
                    "<hiy>$N深吸一口气，运起先天纯阳真气，周身上下金光流转，$W之上阳气大盛，仿佛有炽烈阳炎附着其上！</hiy>",
                    target
                );
                me.add_status({
                    id: "force",
                    name: "纯阳气",
                    duration: duration,
                    prop: {},
                    finish_msg: "<hiy>$N周身的纯阳真气渐渐消散，内力回敛丹田。</hiy>",
                });
                me.set_temp("xtg_cy", 1, duration);
                me.reauto_attack();
            },
            query_desc: function(_me: CHARACTER, lv: number): string {
                const duration = query_xtg_chunyang_duration(lv);
                return `将你的纯阳真气附加于武器或拳脚之上，${(duration / 1000).toFixed(1)}秒内你的伤害都附加你最大内力1%的伤害。`;
            },
        },
        dingyang: {
            name: "定阳气",
            distime: 50000,
            enable_skill: "force",
            mp: 22,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const heal = Math.floor(me.mp * query_xtg_dingyang_percent(lv) / 100);
                me.send_room(
                    "<hiz>$N微微阖目，运起先天功，纯阳真气自丹田升起，如旭日初升，温煦经脉，滋养五脏。\n只见$N面色渐转红润，内伤在纯阳真气的流转下缓缓愈合。</hiz>",
                    target
                );
                me.add_hp(heal);
            },
            query_desc: function(_me: CHARACTER, lv: number): string {
                const pct = query_xtg_dingyang_percent(lv);
                return `使用纯阳内力治疗你的内伤，恢复你${pct}%内力的气血。`;
            },
        },
    };
}

// ═══════════════════════════════════════════
// 先天功 — 公共计算函数
// ═══════════════════════════════════════════

/** 纯阳气持续时间（毫秒）——每级增加50ms，确保个位数等级变化可感知 */
function query_xtg_chunyang_duration(lv: number): number {
    return 10000 + lv * 50;
}

/** 定阳气恢复气血百分比 */
function query_xtg_dingyang_percent(_lv: number): number {
    return 20;
}
