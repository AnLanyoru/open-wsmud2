import { SKILL } from '../../../core/skill/skill.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { PerformData, EnablePropMap } from '../../../core/skill/skill.js';
import type { CHARACTER } from '../../../core/char/character.js';

/**
 * 天罗地网 — 六扇门暗器武功（绝世武功）
 * 使用时如天罗地网难以逃脱而得名
 * 完善度：50%
 */
export default class extends SKILL {
    name = '天罗地网';
    id = 'tianluodiwang';
    grade = 4;
    family = FAMILIES.LIUSHAN;
    desc = '六扇门的暗器武功，使用时如天罗地网难以逃脱而得名';
    can_enables = ['throwing'];

    attack_actions = SKILL.get('throwing')?.attack_actions || [];

    slots = [
        {
            prop: 'tldw_xd_damage',
            value: (_lv: number) => 110,
            format: (val: number) => '血滴子增加' + val + '%的伤害',
        },
        {
            prop: 'tldw_wang_damage',
            value: (_lv: number) => 110,
            format: (val: number) => '天网增加' + val + '%的伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            throwing: {
                gj: 4 + Math.floor(lv * 1.8),
                mz: 4 + Math.floor(lv * 1.8),
                mz_per: 1 + Math.floor(lv / 500),
                diff_fy_per: 1 + Math.floor(lv / 500),
            },
        };
    }

    pfm_set: PerformData = {
        xue: {
            name: '血滴子',
            distime: 16000,
            enable_skill: 'throwing',
            mp: 20,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const threshold = query_xuedizi_threshold(lv);
                const damagePer = 100 + me.query_prop('tldw_xd_damage');

                me.send_room(
                    '<HIR>$N手腕一抖，一道血光破空而出，正是六扇门暗器绝技——「血滴子」！直取$n首级！</HIR>',
                    target,
                );

                const sh = me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    add_bjsh_per: damagePer,
                    attack_msg: '<HIR>$N的血滴子带着破空尖啸，旋转着削向$n的脖颈！</HIR>',
                    damage_msg: '<hir>血滴子正中$n要害，鲜血四溅！</hir>',
                    miss_msg: '<cyn>$n惊险万分地避过了血滴子的致命一击。</cyn>',
                });

                // 斩杀判定：命中且暴击，且目标血量低于阈值百分比
                if (sh && sh > 0) {
                    const hpPer = target.max_hp > 0 ? (target.hp / target.max_hp) * 100 : 100;
                    if (hpPer <= threshold) {
                        // 执行斩杀：造成等于剩余血量的伤害
                        me.send_room('<HIR>血滴子正中$n要害，一击毙命！</HIR>', target);
                        target.from_attack(target.hp, 9999999, '', '');
                    }
                }

                me.end_attack(target);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const threshold = query_xuedizi_threshold(lv);
                return '攻击敌方头部，当敌人血量低于' + threshold + '%时，如果产生暴击则斩杀敌人。';
            },
        },

        wang: {
            name: '天网',
            distime: 60000,
            enable_skill: 'throwing',
            mp: 25,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const busyTime = query_tianwang_busy(lv);
                const faintTime = query_tianwang_faint(lv);
                const damagePer = 100 + me.query_prop('tldw_wang_damage');
                const count = 3 + Math.floor(lv / 500);

                me.send_room(
                    '<HIW>$N双手齐扬，无数暗器如天罗地网般铺天盖地撒向$n，避无可避！</HIW>',
                    target,
                );

                // 判断目标是否已被天网忙乱
                const alreadyTianwang = target.query_temp('tianwang', 0) > 0;

                let totalDamage = 0;
                for (let i = 0; i < count; i++) {
                    const sh = me.do_attack({
                        target: target,
                        gj: me.gj,
                        mz: me.mz,
                        add_bjsh_per: damagePer,
                        no_dodge: true,
                        attack_msg: '<HIW>$N的暗器如暴雨般向$n倾泻而去！</HIW>',
                        damage_msg: '<hir>$n身中数枚暗器，苦不堪言。</hir>',
                    });
                    totalDamage += sh;
                }

                if (totalDamage > 0) {
                    if (alreadyTianwang) {
                        // 已被天网忙乱 → 施加昏迷
                        target.add_status(
                            {
                                id: 'faint',
                                name: '天网',
                                duration: faintTime,
                                is_faint: true,
                                downside: true,
                                desc: '你被天罗地网所困，昏迷不醒。',
                            },
                            me,
                        );
                        target.remove_temp('tianwang');
                        me.send_room(
                            '<HIR>$n被天罗地网层层裹住，眼前一黑，昏了过去！</HIR>',
                            target,
                        );
                    } else {
                        // 首次命中 → 施加忙乱，并标记天网状态
                        target.add_status(
                            {
                                id: 'busy',
                                name: '天网',
                                duration: busyTime,
                                is_busy: true,
                                downside: true,
                                desc: '你被天罗地网所困，动弹不得。',
                                on_attach: function (p: CHARACTER): void {
                                    p.set_temp('tianwang', 1, busyTime);
                                },
                                on_expire: function (p: CHARACTER): void {
                                    p.remove_temp('tianwang');
                                },
                            },
                            me,
                        );
                        me.send_room(
                            '<HIW>$n被天罗地网层层罩住，一时间手忙脚乱，脱身不得！</HIW>',
                            target,
                        );
                    }
                }

                me.end_attack(target);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const busyTime = query_tianwang_busy(lv);
                const faintTime = query_tianwang_faint(lv);
                const count = 3 + Math.floor(lv / 500);
                return (
                    '使用大量暗器攻击敌人' +
                    count +
                    '次，命中后使对方忙乱' +
                    toSec(busyTime) +
                    '秒，如果已经是已被天网忙乱的状态则昏迷' +
                    toSec(faintTime) +
                    '秒。'
                );
            },
        },
    };
}

// ============================================================
// 天罗地网 — 公共计算函数
// ============================================================

/** 血滴子：斩杀血量阈值百分比 */
function query_xuedizi_threshold(lv: number): number {
    return 10 + Math.floor(lv / 2000);
}

/** 天网：忙乱持续时间（毫秒） */
function query_tianwang_busy(lv: number): number {
    return Math.min(5 + Math.floor(lv / 500), 11) * 1000;
}

/** 天网：昏迷持续时间（毫秒） */
function query_tianwang_faint(lv: number): number {
    return Math.min(2 + Math.floor(lv / 500), 8) * 1000;
}
