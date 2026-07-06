import { SKILL } from "../../../../core/skill/skill.js";
import { SKILL_TYPES } from "../../../../core/const.js";
import type { PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
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
        const awePct = zhenshe_awe_pct(lv);
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
     * 震慑——降低附近敌人的伤害
     */
    on_beginfight(me: CHARACTER, target: CHARACTER): void {
        const lv = me.query_skill("changshengjue", 0);
        if (lv <= 0) return;
        const awePct = zhenshe_awe_pct(lv);
        const enemies = me.get_nearby_enemies();
        if (!enemies.length) return;
        me.send_room("<hio>$N长生真气沛然流转，一股苍茫古意弥漫四野，周遭之敌无不心神震荡！</hio>");
        for (const enemy of enemies) {
            enemy.add_status({
                id: "csj_zs",
                name: "震慑",
                desc: "被长生诀震慑",
                duration: 0,
                downside: true,
                no_diff: true,
                only_combat: true,
                prop: {
                    add_sh_per: -awePct,
                }
            }, me);
        }
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
            const cap = int(me.max_hp * capPct / 100);
            if (sh > cap) {
                const excess = sh - cap;
                me.add_hp(int(excess));
                me.add_mp(int(excess));
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

                me.set_temp("csj_bm", 1, 600000); // 10分钟冷却
                me.set_temp("csj_wd", 1, 10000); // 10秒无敌

                me.send_room("<hio>$N体内长生真气应激而发，一股生生不息之力自丹田奔涌而出，刹那肌骨重生，伤势尽复！</hio>\n");
                me.add_hp(me.max_hp);
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
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                me.send_room("<hiz>$N倒转体内真气，天地相乘，阴阳互生，转瞬间重获新生！</hiz>\n", target);

                // 恢复全部气血
                me.add_hp(me.max_hp);

                // 清除负面状态
                me.remove_statuses(function (s: CharacterStatus): boolean {
                    return s.downside === true;
                });

                // 保存内功技能冷却，清除后恢复（天地决不重置内功CD）
                const forceCDs: [string, number][] = [];
                for (const [key, expiry] of me.pfm_cd) {
                    if (key.startsWith("force.")) {
                        forceCDs.push([key, expiry]);
                    }
                }
                me.clear_distime();
                const now = Date.now();
                for (const [key, expiry] of forceCDs) {
                    if (expiry < now) continue;
                    me.pfm_cd.set(key, expiry);
                    if (me.is_player) {
                        me.send('{type:"setDistime",id:"' + key + '",distime:' + (expiry - now) + '}');
                    }

                }

                me.end_attack(target);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                return "沟通天地之力，恢复自身全部气血，清除负面状态，并重置所有技能冷却";
            },
        },
        hundun: {
            name: "混沌诀",
            distime: 60000,
            enable_skill: "force",
            mp: 2320,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = hundun_duration(lv);
                const capPct = hundun_cap_pct(lv);

                me.send_room("<hio>$N双眸微阖，混沌真气自奇经八脉奔涌而出，万法不侵！</hio>\n", target);

                me.add_status({
                    id: "force",
                    name: "混沌诀",
                    duration: duration,
                    override: 2,
                    prop: {},
                    on_attach: (p: CHARACTER) => p.set_temp("csj_hd", capPct, duration),
                    on_expire: (p: CHARACTER) => p.remove_temp("csj_hd"),
                    finish_msg: "<hio>$N周身混沌之气如潮退去。</hio>",
                });

                me.reauto_attack();
                me.end_attack(target);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
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

/** 混沌诀——持续时间（毫秒）：min(30秒, 3000 + lv * 10) */
function hundun_duration(lv: number): number {
    return Math.min(30000, 3000 + lv * 10);
}

/** 震慑——降低伤害%：10 + Math.floor(lv / 200) */
function zhenshe_awe_pct(lv: number): number {
    return 10 + Math.floor(lv / 200);
}

/** 混沌诀——单次伤害上限%：max(3, 15 - Math.floor(lv / 400)) */
function hundun_cap_pct(lv: number): number {
    return Math.max(3, 15 - Math.floor(lv / 400));
}
