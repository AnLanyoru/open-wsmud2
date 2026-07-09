import { SKILL } from '../../../../core/skill/skill.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER } from '../../../../core/char/character.js';

// ============================================================
// 灵犀步 — 公共绝世神功（慈航静斋）
// ============================================================

export default class extends SKILL {
    name = '灵犀步';
    id = 'lingxibu';
    grade = 5;

    desc = '慈航静斋的轻功身法';
    can_enables = ['dodge'];

    dodge_actions = [
        '$n足踏灵犀，身随意转，一式「心有灵犀」，$N的攻势擦身而过，毫发无伤。\n',
        '$n心念微动，步法如羽翼轻展，$N眼前一花，$n已翩然避开。\n',
        '却见$n身形如惊鸿一瞥，足尖轻点，$P已然飘身数丈之外，$N追之不及。\n',
        '$n灵台澄澈，身与意合，$N招数虽精妙，却连$p衣角也未能触及。\n',
    ];

    slots = [
        {
            prop: 'lxb_by',
            value: (_lv: number) => 2000,
            format: (val: number) => '比翼持续时间增加' + toSec(val) + '秒',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: lv * 2 + 300,
                mz: lv * 2 + 300,
                dex: Math.floor(lv / 4) + 31,
                int: Math.floor(lv / 4) + 11,
                diff_downside_per: 15,
            },
        };
    }

    pfm_set: PerformData = {
        biyi: {
            name: '比翼',
            distime: 60000,
            enable_skill: 'dodge',
            mp: 120,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const baseDuration = 10000;
                const extraDuration = me.query_prop('lxb_by');
                const duration = baseDuration + extraDuration;

                me.send_room('<hic>$N心念一动，步法如羽翼轻展，身与意合，万邪不侵！</hic>', target);

                me.add_status({
                    id: 'dodge',
                    name: '比翼',
                    duration: duration,
                    prop: {
                        diff_downside_per: 85,
                    },
                    desc: '身与意合，不受负面状态影响',
                    finish_msg: '$N的比翼身法已散，灵犀不再相通。',
                });

                me.end_attack(target);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                return '10秒内不受负面状态影响。';
            },
        },
    };
}
