import { SKILL, PERFORM } from '../../../core/skill/skill.js';
import { SKILL_TYPES } from '../../../core/const.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { PropMap } from '../../../types/props.js';
import type { PerformData, EnablePropMap } from '../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../core/char/character.js';

/** 完成度 50 */
export default class extends SKILL {
    name = '金刚不灭体';
    id = 'yijinjing4';
    grade = 6;
    force_rad = 1.3;
    family = FAMILIES.SHAOLIN;
    is_ultimate = true;
    desc = '上古佛门心法，金刚不灭万法皆空';
    can_enables = ['force'];

    query_prop(lv: number, me?: CHARACTER): PropMap {
        return {
            diff_sh_per: 10 + int(lv / 200),
        };
    }

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: lv * 3,
                fy: lv * 3,
                fy_per: 10,
                diff_sh_per: 10,
                diff_bj: 10,
                limit_mp: lv * 990,
                desc: '唯一：将你内力的130%转化为气血\n金刚装备后将你12%防御力转化为固定免伤',
            },
        };
    }

    // 不灭金身：反弹伤害 + 免疫伤害
    on_damage(me: CHARACTER, sh: number, from?: CHARACTER): number {
        if (me.query_temp('sk_yjj_jinshen', 0)) {
            if (sh > 0 && from && from.hp > 0) {
                me.send_combat(
                    '<hib>$N的不灭金身佛光反震，将' + sh + '点伤害反弹给$n！</hib>\n',
                    from,
                );
                from.damage3(sh, me);
                me.end_attack(from);
            }
            return 0;
        }
        return sh;
    }

    pfm_set: PerformData = {
        jinshen: {
            name: '不灭金身',
            distime: 60000,
            enable_skill: 'force',
            mp: 1420,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const time: number = 8000 + lv * 5;
                const dur: number = time > 30000 ? 30000 : time;
                me.send_room(
                    '<hiy>$N口诵真言，双手合十，霎时间全身金光大盛，化为不灭金身，万法不侵！</hiy>',
                );
                me.add_status({
                    id: 'force',
                    name: '不灭金身',
                    desc: '免疫大部分伤害，反弹受到的伤害',
                    duration: dur,
                    on_attach: function (p: CHARACTER): void {
                        p.set_temp('sk_yjj_jinshen', 1, dur);
                    },
                    on_expire: function (p: CHARACTER): void {
                        p.remove_temp('sk_yjj_jinshen');
                    },
                    finish_msg: '$N周身金光渐渐散去，不灭金身已敛入体内。',
                });
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const time: number = 8000 + lv * 5;
                const dur: number = time > 30000 ? 30000 : time;
                return (
                    '召唤金身，持续' +
                    toSec(dur) +
                    '秒，免疫大部分伤害，并将受到的伤害全额反弹给攻击者。'
                );
            },
        },
        wanfa: {
            name: '万法皆空',
            distime: 50000,
            enable_skill: 'force',
            mp: 2300,
            use_type: 2,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): boolean | void {
                const list: CHARACTER[] = me.get_nearby_enemies();
                if (!list.length) return me.notify_fail('你周围没有敌人！');
                me.send_room(
                    '<hiy>$N双手合十，口诵佛号，无边佛法如怒潮般向四周席卷而去，所过之处万象俱寂！</hiy>',
                );
                const dmg: number = int(me.max_mp * 0.25);
                for (let i: number = 0; i < list.length; i++) {
                    const x: CHARACTER = list[i];
                    x.notify(
                        '你觉得一股浩瀚无边的佛门真力冲击而来，身心俱震，气血与内力同时受损！',
                    );
                    x.send_combat('<red>$n被$N的万法皆空冲击，气血与内力同时受损！</red>', x);
                    x.damage3(dmg, me);
                    x.add_mp(-dmg);
                    me.end_attack(x);
                }
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const dmg: number = int(me.max_mp * 0.25);
                return (
                    '佛法无边，冲击附近敌人，使对方的气血和内力都受到你25%最大内力(' +
                    dmg +
                    ')的伤害。'
                );
            },
        },
    };
}
