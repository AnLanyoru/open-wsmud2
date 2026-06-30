import {SKILL} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap} from "../../../../core/skill/skill.js";
import type { CHARACTER } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "吸星大法";
    id = "xixingdafa";
    grade = 4;
    force_rad = 0.9;

    desc = "源自魔教的一种诡异功法，可化去他人内力，也能吸内力化为己用。";
    can_enables = ["force"];

    slots = [
        {
            prop: 'xxdf_nl_max',
            value: (lv: number) => 125 * lv,
            format: (val: number) => `内力上限：+${val}`,
        },
        {
            prop: 'xxdf_xzj_cs',
            value: (lv: number) => 3,
            format: (val: number) => `吸字诀持续次数增加${val}次`,
            desc: '吸字诀次数',
        },
        {
            prop: 'xxdf_xzj_sh',
            value: (lv: number) => 20,
            format: (val: number) => `吸字诀每次造成的伤害增加${val}%`,
            desc: '吸字诀伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 30,
                hp_per: 1 + Math.floor(lv / 300),
                fy_per: 1 + Math.floor(lv / 300),
                limit_mp: lv * 155,
                desc: "唯一：将你内力的90%转化为气血\n命中后会化掉对方4000当前内力",
            },
        };
    }

    pfm_set: PerformData = {
        xi: {
            name: "吸字诀",
            distime: 30000,
            enable_skill: "force",
            mp: 0,
            release_time: 5600,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const baseHits = query_xxdf_xizijue_hits(lv);
                const baseGjPct = query_xxdf_xizijue_gj_percent(lv);
                const csBonus = me.query_prop("xxdf_xzj_cs");
                const shBonus = me.query_prop("xxdf_xzj_sh");
                const totalHits = baseHits + csBonus;
                const gjPerHit = Math.floor(me.gj * (baseGjPct + shBonus) / 100);
                const interval = query_xxdf_xizijue_interval(lv);
                const busyDuration = totalHits * interval + 200;

                me.send_room("<him>$N运起吸星大法，双掌翻飞间化出一股诡异吸力，向$n笼罩而去！</him>", target);

                // 首次命中判定
                const firstSh = me.do_attack({
                    target,
                    gj: gjPerHit,
                    mz: me.mz,
                });

                me.end_attack(target);

                if (firstSh <= 0) return;

                // 命中后立刻设置释放时间
                let totalDamage = firstSh;
                target.add_mp(-Math.floor(firstSh * 0.5));
                target.set_releasetime(busyDuration);

                // 后续持续伤害
                me.call_interval(
                    function (i) {
                        const nowTarget = me.query_enemy();
                        if (!nowTarget || nowTarget.hp <= 0) return false;

                        const sh = me.do_attack({
                            target: nowTarget,
                            gj: gjPerHit,
                            mz: me.mz,
                        });

                        if (sh > 0) {
                            totalDamage += sh;
                            nowTarget.add_mp(-Math.floor(sh * 0.5));
                        }

                        me.end_attack(nowTarget);

                        if (!me.enemy?.length) return false;

                        if (i >= totalHits - 2) {
                            if (totalDamage > 0) {
                                me.add_hp(totalDamage);
                                me.send_room("<hio>$N猛地一收掌力，$n周身气血如潮涌般被吸入$N体内！</hio>", target);
                            }
                            return false;
                        }
                        return true;
                    },
                    interval,
                    totalHits - 1,
                );
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const baseHits = query_xxdf_xizijue_hits(lv);
                const baseGjPct = query_xxdf_xizijue_gj_percent(lv);
                const csBonus = me.query_prop("xxdf_xzj_cs");
                const shBonus = me.query_prop("xxdf_xzj_sh");
                const totalHits = baseHits + csBonus;
                const totalGjPct = baseGjPct + shBonus;
                return `命中后使敌人无法行动，每次对敌人造成${totalGjPct}%攻击力的气血和内力伤害，吸收对方受到的伤害转为自身气血，持续${totalHits}次`;
            },
        },
    };
}


// ═══════════════════════════════════════════
// 吸星大法 — 公共计算函数
// ═══════════════════════════════════════════

/** 吸字诀基础攻击次数（不包含进阶加成） */
function query_xxdf_xizijue_hits(lv: number): number {
    return 3 + Math.floor(lv / 500);
}

/** 吸字诀基础伤害百分比（不包含进阶加成） */
function query_xxdf_xizijue_gj_percent(lv: number): number {
    return 101 + Math.floor(lv / 110);
}

/** 吸字诀每段攻击间隔（毫秒），随等级提升而缩短 */
function query_xxdf_xizijue_interval(lv: number): number {
    let interval = 700 - Math.floor(lv / 50);
    if (interval < 500) interval = 500;
    return interval;
}
