import { SKILL } from '../../../../core/skill/skill.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';
// ============================================================
// 圆月弯刀
// ============================================================

export default class extends SKILL {
    name = '圆月弯刀';
    id = 'yuanyuewandao';
    grade = 4;
    is_hidden = true;
    desc = '「魔教」的一项神奇、精妙的刀法，刀法虽然能带给人无穷的力量，却也能带给人不祥和灾祸';
    can_enables = ['blade'];
    attack_actions = [
        '$N手腕轻翻，$W划出一道诡谲的圆弧，月光般的刀芒无声无息斩向$n的$l',
        '$N身形微侧，$W自不可思议的角度弯转而出，如残月悬空般劈向$n的$l',
        '$N目中魔光一闪，$W刀势骤然弯折，绕开$n守势直取其$l',
        '$N踏步欺身，$W化作一弯幽冷的新月，带着不祥之气向$n的$l掠去',
        '$N刀交左手，$W自肘底反撩而出，刀路诡异如月下魅影，斩向$n的$l',
        '$N旋身一转，$W随身形划出一道圆满的弧光，刀未至而寒意已侵$n骨髓',
        '$N口中发出一声低吟，$W仿佛有了灵性，弯出一道不可能的轨迹劈向$n的$l',
        '$N长笑一声，$W脱手飞旋，如一轮血月横空，自天而降斩向$n的$l',
    ];

    learn_condition = {
        dex1: 40,
    };

    slots = [
        {
            prop: 'yywd_bx',
            name: '魔心',
            value: (_lv: number) => 1,
            format: (_val: number) => '入魔后内力耗尽不再昏迷或虚弱',
        },
        {
            prop: 'yywd_xh',
            name: '饮魔',
            value: (_lv: number) => 1,
            format: (_val: number) => '入魔与普攻的内力消耗降低60%',
        },
        {
            prop: 'yywd_md',
            name: '魔临',
            value: (lv: number) => 50 + Math.floor(lv / 10),
            format: (val: number) => `魔刀将附加${val}%攻击力的伤害`,
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        const addShPer = query_yywd_add_sh_per(lv);
        const mpPercent = query_yywd_mp_damage_percent(lv);
        return {
            blade: {
                gj: 10 + lv * 2,
                mz: 20 + lv * 2,
                gjsd_per: 10,
                add_sh_per: addShPer,
                desc: `每次攻击附加你最大内力${mpPercent}%的伤害，内力耗尽后将虚弱6秒`,
            },
        };
    }

    /**
     * 被动——「魔刀噬气」：每刀附加最大内力百分比伤害。
     * 魔教刀法以人饲刀，内力越深刀势越烈。
     */
    on_attack(me: CHARACTER, _target: CHARACTER, par: DoAttackPar): number {
        const lv = me.query_skill('yuanyuewandao', 0);
        if (lv <= 0) return 0;
        const mp_dmg = query_yywd_mp_extra_damage(me, lv);
        const cost_reduce = me.query_prop('yywd_xh');
        me.add_mp(cost_reduce ? -mp_dmg * 0.4 : -mp_dmg);
        const rm_bouns = me.query_temp('yywd_rm', Number(0));
        if (!par.power_gj) par.power_gj = 0;
        par.power_gj += Math.floor((1 + rm_bouns / 100) * mp_dmg);
        return 0;
    }

    /**
     * 每轮攻击结束后检查内力是否耗尽，触发虚弱或昏迷。
     * 内力耗尽为魔刀反噬之兆——常人虚弱，入魔者则陷入昏迷。
     */
    on_attack_over(me: CHARACTER, _target: CHARACTER, _par: DoAttackPar, _sh: number): void {
        if (me.mp > 0) return;
        const lv = me.query_skill('yuanyuewandao', 0);
        if (lv <= 0) return;

        // 魔刀绝招内力耗尽后不触发虚弱/昏迷
        if (me.query_temp('yywd_modao', 0)) return;

        // 进阶「魔心」免除内力耗尽惩罚
        if (me.query_prop('yywd_bx')) return;

        // 检查是否处于入魔状态
        if (me.query_temp('yywd_rm')) {
            me.add_status({
                id: 'faint',
                name: '昏迷',
                is_faint: true,
                downside: true,
                duration: 3000,
                start_msg: '<hiz>$N内力枯竭，魔刀反噬，眼前一黑昏了过去！</hiz>',
            });
        } else {
            me.add_status({
                id: 'wike',
                name: '虚弱',
                downside: true,
                duration: 6000,
                prop: {
                    gj_per: -30,
                    fy_per: -30,
                },
                start_msg: '<hiz>$N内力耗尽，四肢百骸如被抽空，顿感虚弱无力。</hiz>',
                finish_msg: '$N长长吐出一口浊气，内力渐复，虚弱之感烟消云散。',
            });
        }
    }

    pfm_set: PerformData = {
        ru: {
            name: '入魔',
            distime: 60000,
            enable_skill: 'blade',
            mp: 140,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = query_yywd_rumo_duration(lv);
                const bonus = query_yywd_rumo_bonus(lv);

                me.send_room(
                    '<hiz>$N双目赤红，浑身魔气翻涌，发出一声凄厉长啸\n刀意自生，人刀易位，再无「我」与「刀」之分。</hiz>',
                    target,
                );

                me.add_status({
                    id: 'weapon',
                    name: '入魔',
                    desc: '由人驱刀变为刀驱人，内力附加与命中增加，内力耗尽将昏迷',
                    duration: duration,
                    override: 0,
                    prop: {
                        mz_per: bonus,
                    },
                    on_attach: p => p.set_temp('yywd_rm', bonus, duration),
                    on_expire: function (p) {
                        p.remove_temp('yywd_rm');
                    },
                    finish_msg: '$N眼中赤芒一寸寸褪去，魔性暂歇，长刀归寂，重拾清明。',
                });

                me.reauto_attack();
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const duration = (query_yywd_rumo_duration(lv) / 1000).toFixed(1);
                const bonus = query_yywd_rumo_bonus(lv);
                return `${duration}秒内入魔，由人驱刀变为刀驱人，附加的内力和命中增加${bonus}%，内力耗尽后会昏迷3秒`;
            },
        },
        mo: {
            name: '魔刀',
            distime: 30000,
            enable_skill: 'blade',
            mp: 0,
            check: function (me: CHARACTER, _lv: number, _base_type?: string): boolean {
                // 需进阶至橙色（grade 4→5，即至少 1 次进阶）解锁
                const sk = me.skills?.get('yuanyuewandao');
                if (!sk || !sk.addin || sk.addin.length < 1) return false;
                return true;
            },
            use_condition: '需要将圆月弯刀进阶为橙色',
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                if (!target) return;
                const drainedMp = me.mp;
                if (drainedMp <= 0) {
                    me.notify('你内力已竭，无法催动魔刀。');
                    return;
                }

                // 标记魔刀状态，防止 on_attack_over 触发虚弱
                me.set_temp('yywd_modao', 1, 2000);
                me.add_mp(-drainedMp);
                let baseDmg = me.gj;
                // 进阶「魔临」：附加攻击力
                const atk_bonus = me.query_prop('yywd_md');
                if (atk_bonus > 0) {
                    baseDmg += (me.gj * atk_bonus) / 100;
                }

                me.send_room(
                    '<hio>$N将内力尽数灌注$W之中，霎时刀身魔焰冲天，血光映红半天，$W化作一轮血月向$n斩去！</hio>',
                    target,
                );
                let totalDamage = 0;
                // 攻击附近所有敌人
                const enemies = me.enemy?.length ? [...me.enemy] : [target];
                for (let i = 0; i < enemies.length; i++) {
                    const enemy = enemies[i];
                    if (!enemy) continue;
                    const sh = me.do_attack({
                        target: enemy,
                        power_gj: drainedMp,
                        gj: Math.floor(baseDmg),
                        mz: me.mz,
                        no_power: true,
                        attack_msg:
                            i === 0
                                ? '<hio>$N的魔刀挟毁天灭地之势斩落，$n但觉眼前一片血芒，避无可避！</hio>'
                                : undefined,
                        attack_before: i > 0 ? _tmpl('<hio>刀势未尽，紧跟着</hio>') : undefined,
                    });
                    totalDamage += sh;
                }

                // 吸收伤害化为内力
                if (totalDamage > 0) {
                    const absorb = query_yywd_modao_absorb(totalDamage, lv);
                    if (absorb > 0) {
                        me.add_mp(absorb);
                        me.send_room(
                            '<hio>$n伤口处血雾喷涌，$N的$W饮血而归，血煞之气顺刀身灌入$N经脉，化作内力回流。</hio>',
                            target,
                        );
                    }
                }

                for (let i = 0; i < enemies.length; i++) {
                    const enemy = enemies[i];
                    if (enemy) me.end_attack(enemy);
                }
            },
            query_desc: function (_me: CHARACTER, _lv: number): string {
                let desc =
                    '耗尽全身内力驱使魔刀斩向附近敌人，附加同等伤害，内力耗尽后不会虚弱，吸收造成伤害转化为自身内力，此招不会暴击';
                return desc;
            },
        },
    };
}

// ============================================================
// 圆月弯刀 — 公共计算函数（use 与 query_desc 共用，保证一致）
// ============================================================

/** 最终伤害百分比加成 */
function query_yywd_add_sh_per(lv: number): number {
    return 5 + Math.floor(lv / 300);
}

/** 内力附加伤害百分比（用于 desc 显示） */
function query_yywd_mp_damage_percent(lv: number): number {
    return lv / 1000;
}

/** 被动：每次普攻附加的最大内力伤害 */
function query_yywd_mp_extra_damage(me: CHARACTER, lv: number): number {
    return Math.floor((me.max_mp * Math.floor(lv / 1000)) / 100);
}

/** 入魔：持续时间（毫秒） */
function query_yywd_rumo_duration(lv: number): number {
    return 3000 + lv;
}

/** 入魔：攻击力与命中加成百分比 */
function query_yywd_rumo_bonus(lv: number): number {
    return Math.floor(lv / 50);
}

/** 魔刀：基于耗尽内力的附加伤害 */
function query_yywd_modao_bonus_damage(me: CHARACTER, _lv: number, drainedMp: number): number {
    // 基础：耗尽内力
    let bonus = drainedMp;
    return Math.floor(bonus);
}

/** 魔刀：伤害吸收百分比 */
function query_yywd_modao_absorb_percent(_lv: number): number {
    return 100;
}

/** 魔刀：伤害吸收量 */
function query_yywd_modao_absorb(totalDamage: number, lv: number): number {
    return Math.floor((totalDamage * query_yywd_modao_absorb_percent(lv)) / 100);
}
