import {SKILL} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar, CharacterStatus } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "长生诀";
    id = "changshengjue";
    grade = 6;
    force_rad = 1.5;

    desc = "上古奇书长生诀，参悟天地造化，得证长生之道";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        const fyHpPer = 5 + Math.floor(lv / 100);
        const shPer = 5 + Math.floor(lv / 200);
        const awePct = 10 + Math.floor(lv / 200);
        return {
            force: {
                fy_per: fyHpPer,
                hp_per: fyHpPer,
                diff_sh_per: shPer,
                limit_mp: lv * 1000,
                desc: "震慑：降低附近敌人" + awePct + "%的伤害\n不灭：当你的气血降低到10%时候会恢复大量气血，并短时间无视伤害，冷却10分钟\n唯一：将你内力的150%转化为气血",
            },
        };
    }

    /**
     * 不灭——气血低于10%时触发，恢复大量气血并无视伤害，冷却10分钟
     * 混沌诀——单次伤害超过上限时转化为气血和内力
     */
    on_damage(me: CHARACTER, sh: number, from?: CHARACTER): number {
        if (me.query_temp("csj_wd", 0))
            return 0; // 无敌状态，无视伤害
        if (sh <= 0) return sh;

        // 混沌诀：伤害上限检查
        const capPct = me.query_temp("csj_hd", 0);
        if (capPct > 0) {
            const cap = Math.floor(me.max_hp * capPct / 100);
            if (sh > cap) {
                const excess = sh - cap;
                me.add_hp(excess);
                me.add_mp(Math.floor(excess * 0.5));
                sh = cap;
            }
        }

        // 不灭：气血低于10%触发
        const hpPct = me.hp / me.max_hp;
        if (hpPct <= 0.1 && me.hp > 0) {
            const lv = me.query_skill("changshengjue", 0);
            if (lv <= 0) return sh;

            // 检查冷却（10分钟 = 600000ms）
            const lastTrigger = me.query_temp("csj_bm", 0);
            if (!lastTrigger) {
                const healPct = bumie_heal_pct(lv);
                const heal = Math.floor(me.max_hp * healPct / 100);

                me.set_temp("csj_bm", 1, 600000); // 10分钟冷却
                me.set_temp("csj_wd", 1, 10000); // 10秒无敌

                me.send_room("<hio>$N体内长生真气应激而发，一股生生不息的力量自丹田涌出，伤势迅速愈合！</hio>\n");
                me.add_hp(heal);
            }
        }
        return sh;
    }

    pfm_set: PerformData = {
        tiandi: {
            name: "天地决",
            distime: 60000,
            enable_skill: "force",
            mp: 3700,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                me.send_room("<hio>$N沟通天地，长生真气如江河倒灌，周身光华大盛，所有伤势一扫而空！</hio>\n", target);

                // 恢复全部气血
                me.add_hp(me.max_hp);

                // 清除负面状态
                me.remove_statuses(function(s: CharacterStatus): boolean {
                    return s.downside === true;
                });
                me.clear_distime();

                me.end_attack(target);
            },
            query_desc: function(_me: CHARACTER, lv: number): string {
                return "沟通天地之力，恢复自身全部气血，清除负面状态，并重置所有技能冷却";
            },
        },
        hundun: {
            name: "混沌诀",
            distime: 60000,
            enable_skill: "force",
            mp: 2320,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = hundun_duration(lv);
                const capPct = hundun_cap_pct(lv);

                me.send_room("<hio>$N运转混沌诀，周身被混沌之气包裹，任何伤害皆不得超越界限！</hio>\n", target);

                me.add_status({
                    id: "force",
                    name: "混沌诀",
                    duration: duration,
                    override: 2,
                    prop: {},
                    on_attach: (p: CHARACTER) => p.set_temp("csj_hd", capPct, duration),
                    on_expire: (p: CHARACTER) => p.remove_temp("csj_hd"),
                    finish_msg: "<hio>$N周身混沌之气消散。</hio>",
                });

                me.reauto_attack();
                me.end_attack(target);
            },
            query_desc: function(_me: CHARACTER, lv: number): string {
                const duration = hundun_duration(lv);
                const capPct = hundun_cap_pct(lv);
                return toSec(duration) + "秒内，你单次受到的伤害不会超过你气血的" + capPct + "%，超过的伤害将转化为你的气血，内力";
            },
        },
    };

}


// ═══════════════════════════════════════════
// 长生诀 — 公共计算函数
// ═══════════════════════════════════════════

/** 不灭——恢复气血%：50 + Math.floor(lv / 100)，封顶80 */
function bumie_heal_pct(lv: number): number {
    return Math.min(80, 50 + Math.floor(lv / 100));
}

/** 不灭——无敌持续时间（毫秒） */
function bumie_invul_duration(_lv: number): number {
    return 3000;
}

/** 混沌诀——持续时间（毫秒）：min(30秒, 3000 + lv * 10) */
function hundun_duration(lv: number): number {
    return Math.min(30000, 3000 + lv * 10);
}

/** 混沌诀——单次伤害上限%：max(3, 15 - Math.floor(lv / 400)) */
function hundun_cap_pct(lv: number): number {
    return Math.max(3, 15 - Math.floor(lv / 400));
}
