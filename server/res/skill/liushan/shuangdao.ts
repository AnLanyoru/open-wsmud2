import { SKILL } from '../../../core/skill/skill.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { PerformData, EnablePropMap } from '../../../core/skill/skill.js';
import type { CHARACTER } from '../../../core/char/character.js';
import type { PropMap } from '../../../types/props.js';

/**
 * 双刀流 — 六扇门刀法（稀有武技）
 * 适合锦衣卫的群体战斗功法
 * 完善度：50%
 */
export default class extends SKILL {
    name = '双刀流';
    id = 'shuangdao';
    grade = 3;
    family = FAMILIES.LIUSHAN;
    desc = '六扇门的刀法，适合锦衣卫的群体战斗功法';
    can_enables = ['blade'];

    attack_actions = SKILL.get('blade')?.attack_actions || [];

    slots = [
        {
            prop: 'sd_ts_faint',
            value: (_lv: number) => 1,
            format: (_val: number) => '拖刀术使用其他刀造成伤害也会使对方昏迷',
        },
        {
            prop: 'sd_gs_limit',
            value: (_lv: number) => 1,
            format: (_val: number) => '滚刀术在使用其他刀时也可以突破攻速上限',
        },
        {
            prop: 'sd_gs_damage',
            value: (_lv: number) => 50,
            format: (val: number) => '滚刀术期间造成的伤害增加' + val + '%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            blade: {
                gj: 4 + Math.floor(lv * 1.4),
                gjsd_per: 1 + Math.floor(lv / 500),
                mz_per: 1 + Math.floor(lv / 500),
            },
        };
    }

    pfm_set: PerformData = {
        tuo: {
            name: '拖刀术',
            distime: 45000,
            enable_skill: 'blade',
            mp: 20,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const gjBonus = query_tuodao_gj_bonus(lv);

                me.send_room(
                    '<HIY>$N佯作不敌，拖刀便走，$n正欲追击，不料$N猛然回身，刀光如练，当头劈落！</HIY>',
                    target,
                );

                me.do_attack({
                    target: target,
                    gj: me.gj + gjBonus,
                    mz: me.mz,
                    no_dodge: true,
                    attack_msg: '<HIY>$N拖刀转身，回首一刀，$n猝不及防！</HIY>',
                    damage_msg: '<hir>$n被这出其不意的回身一刀劈中，鲜血飞溅！</hir>',
                });

                me.end_attack(target);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const gjBonus = query_tuodao_gj_bonus(lv);
                return '拖刀转身，引诱敌人，回首一刀，附加' + gjBonus + '点攻击，无法躲闪。';
            },
        },

        gun: {
            name: '滚刀术',
            distime: 30000,
            enable_skill: 'blade',
            mp: 20,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = query_guodao_duration(lv);
                const gjsdPer = query_guodao_speed(lv);
                const damagePer = me.query_prop('sd_gs_damage');

                me.send_room(
                    '<HIR>$N刀势一转，刀光滚滚如潮，势不可挡！六扇门「滚刀术」施展开来，刀锋所及，无物不摧！</HIR>',
                    target,
                );

                const prop: PropMap = {
                    gjsd_per: gjsdPer,
                };
                if (damagePer > 0) {
                    prop.add_sh_per = damagePer;
                }

                me.add_status({
                    id: 'busy',
                    name: '滚刀术',
                    duration: duration,
                    is_busy: true,
                    ig_control: true,
                    prop: prop,
                    start_msg: '<HIR>$N刀势如狂，滚刀术施展之下，攻势连绵不绝！</HIR>',
                    finish_msg: '$N刀势渐缓，滚刀术收势回撤。',
                    on_attach: function (p: CHARACTER): void {
                        p.set_temp('sd_gs', 1, duration);
                    },
                    on_expire: function (p: CHARACTER): void {
                        p.remove_temp('sd_gs');
                        // change_buff 会在 on_expire 返回后清除忙乱，下一轮事件循环再恢复普通攻击。
                        p.call_out(() => p.reauto_attack(), 0);
                    },
                });

                // 滚刀术在自身忙乱期内使用独立攻击循环，不改变全局普通攻击下限。
                run_gundao_attack(me, query_gundao_interval(me));
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const duration = query_guodao_duration(lv);
                const gjsdPer = query_guodao_speed(lv);
                return (
                    toSec(duration) +
                    '秒内，增加' +
                    gjsdPer +
                    '%攻速攻击敌人，期间无法被控制，不能释放其他技能。'
                );
            },
        },
    };
}

// ============================================================
// 双刀流 — 公共计算函数
// ============================================================

/** 拖刀术：附加攻击力 */
function query_tuodao_gj_bonus(lv: number): number {
    return 50 + lv;
}

/** 滚刀术：持续时间（毫秒） */
function query_guodao_duration(lv: number): number {
    return Math.min(5000 + Math.floor((lv - 100) / 300) * 1000, 12000);
}

/** 滚刀术：攻速提升百分比 */
function query_guodao_speed(lv: number): number {
    return 30 + Math.floor(lv / 100);
}

/**
 * 查询滚刀术自身循环间隔。
 * 绣春刀天然允许达到250ms；进阶词条允许其他刀具获得相同效果。
 */
function query_gundao_interval(me: CHARACTER): number {
    const weapon = me.query_weapon();
    const canBreakLimit =
        weapon?.path === 'eq/lv5/xiuchundao' || me.query_prop('sd_gs_limit') > 0;
    const limit = canBreakLimit ? 250 : 500;
    let interval = 4000 - me.query_prop('gjsd');
    interval -= (interval * me.query_prop('gjsd_per')) / 100;
    return Math.max(limit, Math.floor(interval));
}

/** 滚刀术专属攻击循环；状态结束后恢复角色原有的自动攻击循环。 */
function run_gundao_attack(me: CHARACTER, interval: number): void {
    if (!me.query_temp('sd_gs') || me.hp <= 0 || !me.fight_type) return;
    const target = me.query_enemy();
    if (!target) {
        me.remove_status('busy');
        return;
    }

    if (!me.is_faint && target.fight_type) {
        me.do_attack({ target, gj: me.gj, mz: me.mz });
        me.end_attack(target);
    }

    if (me.query_temp('sd_gs') && me.hp > 0 && me.fight_type) {
        me.call_out(() => run_gundao_attack(me, interval), interval);
    }
}
