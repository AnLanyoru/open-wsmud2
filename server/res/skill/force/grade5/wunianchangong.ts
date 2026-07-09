import { SKILL } from '../../../../core/skill/skill.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar, CharacterStatus } from '../../../../core/char/character.js';

export default class extends SKILL {
    name = '无念禅功';
    id = 'wunianchangong';
    grade = 5;
    force_rad = 1.0;

    desc = '净念禅宗的内功心法，修至化境可心入无念，以禅意化万法，将内力尽数转化为生机气血。';

    can_enables = ['force'];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 30,
                fy: 5 + lv * 3,
                hp_per: 10 + Math.floor(lv / 300),
                fy_per: 10 + Math.floor(lv / 300),
                diff_sh_per: 5 + Math.floor(lv / 300),
                limit_mp: lv * 250,
                desc: '唯一：将你内力的100%转化为气血',
            },
        };
    }

    /**
     * 无念——攻击时附加内力伤害
     */
    on_attack(me: CHARACTER, _target: CHARACTER, par: DoAttackPar): number {
        if (me.query_temp('wn_wn', 0)) {
            if (!par.power_gj) par.power_gj = 0;
            par.power_gj += Math.floor((me.max_mp * 1) / 100);
        }
        return 0;
    }

    pfm_set: PerformData = {
        jing: {
            name: '净念',
            distime: 30000,
            enable_skill: 'force',
            mp: 50,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                me.send_room(
                    '<hic>$N双手合十，口诵禅音，一念清净，万般烦恼尽皆消散。</hic>',
                    target,
                );
                me.send('<hic>你默诵净念禅咒，心湖澄澈，万般负面尽去。</hic>');
                // 清除自身所有负面状态
                me.remove_statuses((s: CharacterStatus) => s.downside === true);
                // 清除目标所有可清除的正面状态
                if (target) {
                    target.remove_statuses(
                        (s: CharacterStatus): boolean =>
                            !!(
                                !s.downside &&
                                !s.is_busy &&
                                !s.is_faint &&
                                !s.no_clear &&
                                s.prop &&
                                Object.keys(s.prop).length > 0
                            ),
                    );
                    target.send('<hic>$N念力所至，$n周身护体灵光尽被涤荡一空。</hic>');
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '清除自身所有负面状态，并清除敌人所有可清除的正面状态。';
            },
        },
        wu: {
            name: '无念',
            distime: 30000,
            enable_skill: 'force',
            mp: 40,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                const dr = wunian_dr(lv);
                me.send_room('<hic>$N心入无念之境，神意空明，万法不侵。</hic>', target);
                me.add_status({
                    id: 'force',
                    name: '无念',
                    duration: 10000,
                    prop: { diff_sh_per: dr },
                    on_attach: (p: CHARACTER) => p.set_temp('wn_wn', 1, 10000),
                    on_expire: (p: CHARACTER) => p.remove_temp('wn_wn'),
                    finish_msg: '$N从无念禅境中回神。',
                });
                me.reauto_attack();
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                const dr = wunian_dr(lv);
                const pct = 1;
                return (
                    '无念护体，10秒内增加' +
                    dr +
                    '%伤害减免，每次攻击附加内力上限' +
                    pct +
                    '%的额外伤害。'
                );
            },
        },
        bi: {
            name: '闭口禅',
            distime: 50000,
            enable_skill: 'force',
            mp: 80,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                if (!target) {
                    me.notify_fail('没有目标！');
                    return;
                }
                const pct = bikou_dmg_pct(lv);
                const forbidTime = bikou_forbid_time(lv);
                const dmg = Math.floor((me.max_mp * pct) / 100);
                me.send_room('<red>$N闭口不言，以心印心，禅意如刀，直透$n心神！</red>', target);
                target.send('<red>你被$N的无念禅意震慑，一时无法施展绝学！</red>');
                target.from_attack(dmg, 999999, '', '<red>$n被无念禅意震慑，心神受创！</red>');
                target.add_status(
                    {
                        id: 'bikou',
                        name: '闭口',
                        duration: forbidTime,
                        downside: true,
                        prop: { no_pfm: 1 },
                        desc: '你被闭口禅震慑，无法释放绝招。',
                    },
                    me,
                );
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                const pct = bikou_dmg_pct(lv);
                const forbidTime = bikou_forbid_time(lv);
                return (
                    '造成内力上限' +
                    pct +
                    '%的内力伤害，并禁止对方绝招' +
                    toSec(forbidTime) +
                    '秒。'
                );
            },
        },
    };
}

// ============ 公共计算函数 ============

function wunian_dr(lv: number): number {
    return 30 + Math.floor(lv / 300);
}

function bikou_dmg_pct(lv: number): number {
    return 10 + Math.floor(lv / 200);
}

function bikou_forbid_time(lv: number): number {
    return Math.min(17000, 2000 + lv * 10);
}
