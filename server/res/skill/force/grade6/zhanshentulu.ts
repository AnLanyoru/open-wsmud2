import {SKILL} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar, CharacterStatus } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "战神图录";
    id = "zhanshentulu";
    grade = 6;
    force_rad = 1.4;

    desc = "源自上古战神秘典，破碎虚空，唯我独尊";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        const awePct = 10 + Math.floor(lv / 200);
        const posuiPct = (lv / 1000).toFixed(1);
        return {
            force: {
                str: lv * 1,
                dex: lv * 1,
                con: lv * 1,
                int: lv * 1,
                limit_mp: lv * 1050,
                desc: "震慑：降低附近敌人" + awePct + "%的防御和免伤\n破碎：每次的攻击都附加最大内力" + posuiPct + "%的伤害，当你空手时附加的内力加倍，并吸收部分伤害\n唯一：将你内力的140%转化为气血",
            },
        };
    }

    /**
     * 破碎——每次攻击附加最大内力百分比伤害，空手时加倍
     */
    on_attack(me: CHARACTER, _target: CHARACTER, par: DoAttackPar): number {
        const lv = me.query_skill("zhanshentulu", 0);
        if (lv <= 0) return 0;

        let pct = lv / 1000;
        const weapon = me.query_weapon();
        if (!weapon) {
            pct *= 2; // 空手时加倍
        }

        const bonusDmg = Math.floor(me.max_mp * pct / 100);
        if (bonusDmg > 0) {
            if (!par.power_gj) par.power_gj = 0;
            par.power_gj += bonusDmg;

            // 吸收部分伤害为气血
            const absorb = Math.floor(bonusDmg * 0.3);
            if (absorb > 0) {
                me.add_hp(absorb);
            }
        }
        return 0;
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "战神决",
            distime: 60000,
            enable_skill: "force",
            mp: 920,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = zhanshenjue_duration(lv);

                me.send_room("<hio>$N仰天长啸，战神附体！一股睥睨天下的磅礴战意冲天而起！</hio>\n", target);

                me.add_status({
                    id: "force",
                    name: "战神决",
                    duration: duration,
                    override: 2,
                    ig_control: true,
                    prop: {
                        gj_per: 50,
                        mz_per: 50,
                        gjsd_per: -30,
                        diff_sh_per: 30,
                    },
                    finish_msg: "<hio>$N周身战神之气渐散，恢复常态。</hio>",
                });

                me.reauto_attack();
                me.end_attack(target);
            },
            query_desc: function(_me: CHARACTER, lv: number): string {
                const duration = zhanshenjue_duration(lv);
                return "战神附体，短时间内大幅增加你的战力，免疫控制，持续" + toSec(duration) + "秒";
            },
        },
        pfm_1: {
            name: "湮灭",
            distime: 45000,
            enable_skill: "force",
            mp: 1270,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                if (!target || target.hp <= 0) {
                    me.notify_fail("没有目标！");
                    return;
                }

                const mpPct = yanmie_mp_pct(lv);
                const dmg = Math.floor(me.max_mp * mpPct / 100);

                me.send_room("<hio>$N一拳轰出，虚空破碎！湮灭之力如潮水般涌向$n！</hio>\n", target);

                // 造成最大内力百分比伤害
                target.damage3(dmg, me);

                // 清除目标所有持续状态
                target.remove_statuses(function(s: CharacterStatus): boolean {
                    return true;
                });

                // 减少对方伤害和破防
                const duration = yanmie_debuff_duration(lv);
                target.add_status({
                    id: "zhanshentulu_ym",
                    name: "湮灭",
                    desc: "被战神图录湮灭之力压制",
                    duration: duration,
                    downside: true,
                    no_diff: true,
                    prop: {
                        add_sh_per: -30,
                        diff_fy_per: -30,
                    },
                    finish_msg: "<hio>$n身上的湮灭之力消散。</hio>",
                }, me);

                me.end_attack(target);
            },
            query_desc: function(_me: CHARACTER, lv: number): string {
                const mpPct = yanmie_mp_pct(lv);
                return "一拳破天地，对敌人造成" + mpPct + "%最大内力的伤害后重置对方的所有附加的持续状态，减少对方的伤害和破防";
            },
        },
        pfm_2: {
            name: "破碎九重天",
            distime: 60000,
            enable_skill: "force",
            mp: 0,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const enemies = me.get_nearby_enemies();
                if (!enemies.length) {
                    me.send_room("<hio>$N拳势凝聚，但四周并无敌人可破。", target);
                    me.end_attack(target);
                    return;
                }

                const mpPct = posui9_mp_pct(lv);
                const consumeMp = Math.floor(me.mp * mpPct / 100);

                if (consumeMp <= 0) {
                    me.notify_fail("你的内力不足以施展破碎九重天！");
                    me.end_attack(target);
                    return;
                }

                // 消耗当前内力
                me.add_mp(-consumeMp);

                me.send_room("<hio>$N怒喝一声，一拳轰出——破碎九重天！苍穹为之震颤，霸绝天地的拳劲横扫四方！</hio>\n", target);

                for (const enemy of enemies) {
                    // 造成同等伤害
                    enemy.damage3(consumeMp, me);

                    // 昏迷7秒
                    enemy.add_status({
                        id: "faint",
                        name: "昏迷",
                        desc: "被破碎九重天震晕",
                        is_faint: true,
                        downside: true,
                        duration: 7000,
                    }, me);
                }

                me.end_attack(target);
            },
            query_desc: function(_me: CHARACTER, lv: number): string {
                const mpPct = posui9_mp_pct(lv);
                return "消耗你" + mpPct + "%的当前内力，对附近敌人造成同等伤害，并使他们昏迷7秒。";
            },
        },
    };
}


// ═══════════════════════════════════════════
// 战神图录 — 公共计算函数
// ═══════════════════════════════════════════

/** 战神决持续时间（毫秒） */
function zhanshenjue_duration(_lv: number): number {
    return 10000;
}

/** 湮灭——最大内力伤害%：1 + Math.floor(lv / 100)，封顶51 */
function yanmie_mp_pct(lv: number): number {
    return Math.min(51, 1 + Math.floor(lv / 100));
}

/** 湮灭——debuff持续时间（毫秒） */
function yanmie_debuff_duration(lv: number): number {
    return 5000 + lv * 2;
}

/** 破碎九重天——消耗当前内力%：20 + Math.floor(lv / 200) */
function posui9_mp_pct(lv: number): number {
    return 20 + Math.floor(lv / 200);
}

/** 毫秒转秒显示 */
function toSec(ms: number): string {
    return (ms / 1000) + "";
}
