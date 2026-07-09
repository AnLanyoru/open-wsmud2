import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import { SKILL_TYPES } from '../../../../core/const.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

export default class extends SKILL {
    name = '先天功';
    id = 'xiantiangong';
    grade = 4;
    force_rad = 0.82;

    desc = '由重阳真人所创的一门道家绝妙武功，至刚至阳';
    can_enables = ['force'];
    slots = [
        {
            prop: 'limit_mp',
            value: (lv: number) => 110 * lv,
            format: (val: number) => '内力上限：+' + val,
            query_needs: function (_lv: number) {
                return [
                    {
                        path: 'book/wudao',
                        count: 10,
                    },
                    {
                        path: 'book/bc#xiantiangong',
                        count: 25,
                    },
                ];
            },
        },
        {
            prop: 'xtg_dyq_nl',
            value: (_lv: number) => 1,
            format: (_val: number) => '定阳气会同步恢复内力',
        },
        {
            prop: 'xtg_cyq_fz',
            value: (lv: number) => 30 + int(lv / 100),
            format: (val: number) => `纯阳气期间对敌人造成${val}%防御力的反震伤害`,
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: 100 + Math.floor(lv * 1.9),
                hp_per: 3 + Math.floor(lv / 200),
                fy_per: 3 + Math.floor(lv / 200),
                limit_mp: lv * 190,
                desc: '唯一：将你内力的82%转化为气血',
            },
        };
    }

    /**
     * 纯阳气——每击附加最大内力1%的伤害。
     */
    on_attack(me: CHARACTER, _target: CHARACTER, par: DoAttackPar): number {
        if (me.query_temp('xtg_cy', 0)) {
            if (!par.power_gj) par.power_gj = 0;
            const lv = me.query_skill('xiantiangong', 0);
            par.power_gj += Math.floor((me.max_mp * (1 + Math.floor(lv / 2000))) / 100);
        }
        return 0;
    }

    /**
     * 纯阳气——受到伤害时反震40%防御力的伤害给攻击者。
     * sh > 0 守卫防止 damage3 递归触发反震（damage3 以 sh=0 调用 on_damage）。
     */
    on_damage(me: CHARACTER, sh: number, from?: CHARACTER): number {
        if (sh > 0 && me.query_temp('xtg_cy', 0) && from && from.hp > 0) {
            const pct = me.query_prop('xtg_cyq_fz');
            const recoil = Math.floor((me.fy * pct) / 100);
            if (recoil > 0) {
                me.send_combat(
                    '<hib>$N的纯阳真气反震，将' + recoil + '点伤害反弹给$n！</hib>\n',
                    from,
                );
                from.damage3(recoil, me);
                me.end_attack(from);
            }
        }
        return sh;
    }

    pfm_set: PerformData = {
        chun: {
            name: '纯阳气',
            distime: 30000,
            enable_skill: 'force',
            mp: 45,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = query_xtg_chunyang_duration(lv);
                me.send_room(
                    '<hiy>$N深吸一口气，运起先天纯阳真气，周身上下金光流转，$W之上阳气大盛，仿佛有炽烈阳炎附着其上！</hiy>',
                    target,
                );
                me.add_status({
                    id: 'force',
                    name: '纯阳',
                    duration: duration,
                    desc: '伤害附加最大内力1%的伤害',
                    prop: {},
                    finish_msg: '<hiy>$N周身的纯阳真气渐渐消散，内力回敛丹田。</hiy>',
                });
                me.set_temp('xtg_cy', 1, duration);
                me.reauto_attack();
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const duration = query_xtg_chunyang_duration(lv);
                return `将你的纯阳真气附加于武器或拳脚之上，${toSec(duration)}秒内你的伤害都附加你最大内力1%的伤害。`;
            },
        },
        ding: {
            name: '定阳气',
            distime: 50000,
            enable_skill: 'force',
            mp: 22,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const heal = int((me.mp * query_xtg_dingyang_percent(lv)) / 100);
                me.send_room(
                    '<hiz>$N微微阖目，运起先天功，纯阳真气自丹田升起，如旭日初升，温煦经脉，滋养五脏。\n只见$N面色渐转红润，内伤在纯阳真气的流转下缓缓愈合。</hiz>',
                    target,
                );
                me.add_hp(heal);
                if (me.query_prop('xtg_dyq_nl')) me.add_mp(heal);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const pct = query_xtg_dingyang_percent(lv);
                return `使用纯阳内力治疗你的内伤，恢复你${pct}%内力的气血。`;
            },
        },
    };
}

// ═══════════════════════════════════════════
// 先天功 — 公共计算函数
// ═══════════════════════════════════════════

/** 纯阳气持续时间（毫秒）：4000 + lv*10，与正式服一致 */
function query_xtg_chunyang_duration(lv: number): number {
    return 4000 + lv * 10;
}

/** 定阳气恢复气血百分比 */
function query_xtg_dingyang_percent(lv: number): number {
    return 10 + Math.floor(lv / 100);
}
