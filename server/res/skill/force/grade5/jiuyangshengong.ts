import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER } from '../../../../core/char/character.js';

export default class extends SKILL {
    name = '九阳神功';
    id = 'jiuyangshengong';
    grade = 5;
    force_rad = 1.0;

    desc = '出自少林的一部神秘经书内的内功心法。';
    can_enables = ['force'];

    query_enable_prop(lv: number): EnablePropMap {
        const fanZhenDamage = calc_fanzhen_damage(lv);
        return {
            force: {
                fy: 100 + lv * 3,
                fy_per: 5 + Math.floor(lv / 100),
                diff_sh_per: 3 + Math.floor(lv / 300),
                hp_per: 3 + Math.floor(lv / 300),
                limit_mp: lv * 290,
                desc: `当被命中后对敌人造成${fanZhenDamage}点反震伤害\n唯一：将你内力的100%转化为气血`,
            },
        };
    }

    /**
     * 反震伤害 — 受到伤害时将九阳真气反震给攻击者，造成真实伤害。
     * 九阳护体激活期间反震伤害翻倍。
     */
    on_damage(me: CHARACTER, sh: number, from?: CHARACTER): number {
        if (sh > 0 && from && from.hp > 0) {
            const lv = me.query_skill('jiuyangshengong', 0);
            let recoil = calc_fanzhen_damage(lv);
            const jyht = me.query_temp('jyht', 0);
            if (jyht) {
                recoil *= 2;
            }
            if (recoil > 0) {
                me.send_combat(
                    '<hiy>$N体内九阳真气受击而激，纯阳之力反噬而出，$n被震得气血翻涌！</hiy>\n',
                    from,
                );
                from.damage3(recoil, me);
                me.end_attack(from);
            }
        }
        return sh;
    }

    pfm_set: PerformData = {
        huti: {
            name: '九阳护体',
            distime: 60000,
            enable_skill: 'force',
            mp: 20,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = calc_huti_duration(lv);
                const diffSh = calc_huti_diff_sh(lv);
                me.send_room(
                    '<hiy>$N运起九阳神功，纯阳真气布满全身，霎时金光流转，$N整个人仿若烈阳！</hiy>',
                    target,
                );
                me.add_status({
                    id: 'force',
                    name: '九阳护体',
                    duration: duration,
                    prop: {
                        diff_sh_per: diffSh,
                    },
                    on_attach: (p: CHARACTER) => p.set_temp('jyht', 1, duration),
                    on_expire: (p: CHARACTER) => p.remove_temp('jyht'),
                    finish_msg: '<hiy>$N周身金光渐黯，九阳真气如潮退敛，复归丹田。</hiy>',
                });
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const duration = calc_huti_duration(lv);
                const diffSh = calc_huti_diff_sh(lv);
                return `将九阳真气布满全身，${toSec(duration)}秒内增加你${diffSh}%的伤害减免，且反震伤害加倍。`;
            },
        },
        zhenyan: {
            name: '九阳真焰',
            distime: 40000,
            enable_skill: 'force',
            mp: 20,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const pct = calc_zhenyan_percent(lv);
                me.send_room(
                    '<hiy>$N运起九阳神功，单掌一翻，一股炽烈无比的纯阳真气化作赤焰，直扑$n而去！</hiy>',
                    target,
                );
                const sh = me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    attack_msg: '<hir>$N掌心赤焰大盛，一道灼热的真气直透$n胸臆！</hir>',
                    damage_msg: '<hir>$n闷哼一声，被九阳真焰灼伤经脉，面露痛苦之色！</hir>',
                    miss_msg: '<hiy>$n大惊之下连连闪避，堪堪躲过这炽烈一击。</hiy>',
                });
                if (sh) {
                    target.add_status(
                        {
                            id: 'jyzy',
                            name: '阳焰',
                            duration: 3000,
                            duration_count: 4,
                            downside: true,
                            on_interval: function (t: CHARACTER, _over_count: number): void {
                                const dmg = int((me.hp * pct) / 400);
                                t.damage(dmg, me);
                                me.end_attack(t);
                            },
                            start_msg: '<hir>$n被九阳真焰附体，浑身灼痛难当！</hir>',
                            finish_msg: '<hiy>$n身上的九阳真焰终于缓缓熄灭。</hiy>',
                        },
                        me,
                    );
                }
                me.end_attack(target);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const pct = calc_zhenyan_percent(lv);
                return `对敌人造成伤害，命中后12秒内受到你当前气血${pct}%的内功伤害。`;
            },
        },
    };
}

// ═══════════════════════════════════════════
// 九阳神功 — 公共计算函数
// ═══════════════════════════════════════════

/** 反震伤害：Math.floor(lv * lv / 300) + lv + 1000 */
function calc_fanzhen_damage(lv: number): number {
    return Math.floor((lv * lv) / 300) + lv + 1000;
}

/** 九阳护体持续时间（毫秒）：Math.min(10000, 4000 + lv * 10) */
function calc_huti_duration(lv: number): number {
    return Math.min(10000, 4000 + lv * 10);
}

/** 九阳护体伤害减免百分比：Math.min(100, 50 + Math.floor(lv / 100)) */
function calc_huti_diff_sh(lv: number): number {
    return Math.min(100, 50 + Math.floor(lv / 100));
}

/** 九阳真焰当前气血伤害百分比：5 + Math.floor(lv / 625) */
function calc_zhenyan_percent(lv: number): number {
    return 5 + Math.floor(lv / 625);
}
