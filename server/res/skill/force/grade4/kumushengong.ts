import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "枯木神功";
    id = "kumushengong";
    grade = 4;
    force_rad = 0.9;

    desc = "天龙寺的高级内功心法";
    can_enables = ["force"];
    slots = [
        {
            prop: "kmsg_nl_max",
            value: (lv: number) => 120,
            format: (val: number) => '内力上限：+120000',
            desc: "枯木神功内力上限",
        },
        {
            prop: "kmsg_fc_ms",
            value: (lv: number) => 15,
            format: (val: number) => '枯木逢春使用后8秒内增加自己15%免伤',
            desc: "枯木逢春后免伤",
        },
        {
            prop: "kmsg_sm_hf",
            value: (lv: number) => 40,
            format: (val: number) => '战斗中首次受到致命伤害时恢复40%气血，冷却10分钟',
            desc: "枯木神功致命恢复",
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 10,
                fy: lv * 2,
                con: 4 + Math.floor(lv * 0.25),
                limit_mp: lv * 180,
                desc: "唯一：将你内力的90%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        kumufengchun: {
            name: "枯木逢春",
            distime: 60000,
            enable_skill: "force",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const hpHeal = kumufengchun_heal(me, lv);

                me.send_room(
                    "<hiz>$N阖目凝神，默运枯木生花之法，体内真气如枯木逢春般勃发，周身泛起淡淡青光。</hiz>\n",
                    target
                );

                // 治疗自身
                me.add_hp(hpHeal);

                me.send_room(
                    "<hiz>$N吐出一口浊气，面色由白转红，伤势已愈大半。</hiz>\n",
                    target
                );

                // 移除所有负面状态
                me.clear_downside(true);

                me.send_room(
                    "<hiz>青光流转之间，$N所中诸般负面状态如冰雪消融，荡然无存。</hiz>\n",
                    target
                );
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                const hpHeal = kumufengchun_heal(me, lv);
                const pct = 10 + Math.floor(lv / 100);
                return "<hiz>枯木逢春：</hiz>恢复" + hpHeal + "点气血（" + pct + "%最大气血），移除你自身的负面状态。";
            },
        },
    };
}


// ═══════════════════════════════════════════
// 枯木神功 — 公共计算函数
// ═══════════════════════════════════════════

/** 枯木逢春回血量：20%最大气血 */
function kumufengchun_heal(me: CHARACTER, lv: number): number {
    const pct = 10 + Math.floor(lv / 100);
    return Math.floor(me.max_hp * pct / 100);
}
