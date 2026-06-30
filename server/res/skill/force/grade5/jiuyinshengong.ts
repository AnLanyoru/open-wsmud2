import { SKILL } from "../../../../core/skill/skill.js";
import { SKILL_TYPES } from "../../../../core/const.js";
import type { PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { LearnCondition } from "../../../../types/events.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "九阴神功";
    id = "jiuyinshengong";
    grade = 5;
    force_rad = 0.9;

    desc = "一种至阴至寒的绝世神功，使用得当会大幅激发你的潜能";
    can_enables = ["force"];
    learn_condition: LearnCondition = {
        str1: 35,
        dex1: 35,
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 20,
                mz: lv * 2 + 200,
                diff_fy_per: 3 + Math.floor(lv / 300),
                limit_mp: lv * 285,
                desc: "命中后会使敌人减少攻击，躲闪，命中1%\n唯一：将你内力的90%转化为气血",
            },
        };
    }

    /**
     * 命中后给目标附加「九阴劲气」，每层降低攻击/躲闪/命中1%
     * 持续时间12秒，每次命中刷新
     */
    on_attack_over(me: CHARACTER, target: CHARACTER, _par: DoAttackPar, sh: number): void {
        if (sh <= 0) return;
        if (!target || target.hp <= 0) return;

        const count = target.query_temp("jyjq", 0) + 1;
        target.set_temp("jyjq", count, 1000);

        target.add_status({
            id: "jyjq",
            name: "阴气",
            desc: "九阴劲气侵蚀",
            duration: 10000,
            override: 2,
            downside: true,
            no_diff: true,
            prop: {
                gj_per: -count,
                ds_per: -count,
                mz_per: -count,
            },
        }, me);
    }

    pfm_set: PerformData = {
        zhuihun: {
            name: "追魂",
            distime: 30000,
            enable_skill: "force",
            mp: 20,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                let count = target.query_temp("jyjq", Number(0));
                if (count <= 0) count = 1;

                const dmgPerStack = zhuihun_dmg(me, lv);
                const dmg = dmgPerStack * count;

                me.send_room("<hio>$N潜运九阴，神意如刀，$n周身蛰伏的九阴劲气如惊蛰春雷，霎时迸裂！</hio>\n", target);

                target.damage3(dmg, me);

                // 清除劲气叠加
                target.remove_status("jyjq");

                if (count > 5) {
                    const stunTime = zhuihun_stun(lv);
                    target.add_status({
                        id: "faint",
                        name: "昏迷",
                        is_faint: true,
                        downside: true,
                        duration: stunTime,
                        desc: "你被九阴劲气震得昏迷过去。",
                    }, me);
                    me.send_room("<hio>$n只觉一股沛然阴劲自体内炸开，眼前一黑，昏厥倒地！</hio>\n", target);
                }

                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const dmg = zhuihun_dmg(me, lv);
                const stun = zhuihun_stun_str(lv);
                return "引爆敌人身上的九阴劲气，每层造成" + dmg + "的真实伤害，层数大于5层将使敌方昏迷" + stun + "秒。";
            },
        },
        nizhuan: {
            name: "逆转九阴",
            distime: 60000,
            enable_skill: "force",
            mp: 20,
            release_time: 500,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const dur = nizhuan_dur(lv);
                const gjPer = nizhuan_gj_per(lv);
                const speedPer = nizhuan_speed_per(lv);
                const debuff = nizhuan_debuff(lv);

                me.send_room("<hio>$N逆转九阴，真气倒行，周身阴煞翻涌如潮，杀意弥天！</hio>\n", target);

                me.add_status({
                    id: "force",
                    name: "逆转九阴",
                    duration: dur,
                    prop: {
                        gj_per: gjPer,
                        diff_fy_per: gjPer,
                        gjsd_per: speedPer,
                        fy_per: -debuff,
                        diff_sh_per: -debuff,
                    },
                    finish_msg: "$N周身阴煞如潮退去，气归丹田，复转如常。",
                });

                me.reauto_attack();
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const dur = nizhuan_dur_str(lv);
                const gjPer = nizhuan_gj_per(lv);
                const speedPer = nizhuan_speed_per(lv);
                const debuff = nizhuan_debuff(lv);
                return "逆转九阴，全力攻击，" + dur + "秒内增加你" + gjPer + "%的攻击，" + gjPer + "%的无视防御，" + speedPer + "%的攻击速度，减少你" + debuff + "%的防御和伤害减免";
            },
        },
    };
}


// ═══════════════════════════════════════════
// 九阴神功 — 公共计算函数
// ═══════════════════════════════════════════

/** 追魂每层真实伤害：gj × (0.1 + floor(lv/50)×0.01) */
function zhuihun_dmg(me: CHARACTER, lv: number): number {
    const coeff = 0.1 + Math.floor(lv / 50) * 0.01;
    return Math.floor(me.gj * coeff);
}

/** 追魂昏迷时间（毫秒），层数>5触发，封顶10000ms */
function zhuihun_stun(lv: number): number {
    return Math.min(10000, 3000 + lv * 3);
}

/** 追魂昏迷时间显示（秒） */
function zhuihun_stun_str(lv: number): string {
    const val = zhuihun_stun(lv) / 1000;
    return val.toFixed(3).replace(/\.0+$/, "");
}

/** 逆转九阴持续时间（毫秒） */
function nizhuan_dur(lv: number): number {
    return 5000 + lv * 6;
}

/** 逆转九阴持续时间显示（秒） */
function nizhuan_dur_str(lv: number): string {
    const val = nizhuan_dur(lv) / 1000;
    return val.toFixed(3).replace(/\.0+$/, "");
}

/** 逆转九阴攻击/无视防御加成%，封顶100 */
function nizhuan_gj_per(lv: number): number {
    return Math.min(100, 20 + Math.floor(lv / 50));
}

/** 逆转九阴攻速加成%，封顶50 */
function nizhuan_speed_per(lv: number): number {
    return Math.min(50, 10 + Math.floor(lv / 100));
}

/** 逆转九阴防御/减伤惩罚%，最低10 */
function nizhuan_debuff(lv: number): number {
    return Math.max(10, 50 - Math.floor(lv / 100));
}