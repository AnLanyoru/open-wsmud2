import { SKILL, PERFORM } from '../../../core/skill/skill.js';
import { SKILL_TYPES } from '../../../core/const.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { PropMap } from '../../../types/props.js';
import type { PerformData, EnablePropMap } from '../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../core/char/character.js';

/** 完成度 50 */
export default class extends SKILL {
    name = '金刚不坏体';
    id = 'yijinjing2';
    source_skill = 'yijinjing';
    grade = 5;
    force_rad = 0.9;
    family = FAMILIES.SHAOLIN;
    desc = '少林寺的高级内功心法，为少林寺镇寺之宝';
    can_enables = ['force'];

    query_prop(lv: number, me?: CHARACTER): PropMap {
        return {
            diff_sh_per: 8 + int(lv / 300),
        };
    }

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 20,
                fy: 5 + lv * 2,
                diff_bj: 3,
                fy_per: 8,
                limit_mp: lv * 285,
                desc: '唯一：将你内力的90%转化为气血',
            },
        };
    }

    pfm_set: PerformData = {
        foguang: {
            name: '佛光守护',
            distime: 30000,
            enable_skill: 'force',
            mp: 20,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const dur: number = lv * 10 + 10000;
                me.send_room(
                    '<hiy>$N高呼佛号，运起佛光普照，霎那间全身竟犹如镀金一般，发出灿灿金光，辉映四方。</hiy>',
                );
                const tm: CHARACTER[] = me.team || [me];
                for (let i: number = 0; i < tm.length; i++) {
                    const x: CHARACTER = tm[i];
                    if (x.hp > 0 && x.is_here(me)) {
                        x.add_status({
                            id: 'foguang',
                            name: '佛光普照',
                            desc: '金刚不坏体之佛光普照，增加你的伤害减免',
                            duration: dur,
                            prop: {
                                diff_sh_per2: 30,
                            },
                            start_msg: '<hiy>$N被一层祥和的金色佛光笼罩，身心安宁。</hiy>',
                            finish_msg: '<hiy>$N身上的佛光渐渐消散。</hiy>',
                        });
                    }
                }
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const dur: number = lv * 10 + 10000;
                return '召唤佛光守护，增加你队友的伤害减免30%，持续' + toSec(dur) + '秒。';
            },
        },
        roar: {
            name: '狮子吼',
            distime: 30000,
            enable_skill: 'force',
            mp: 20,
            use_type: 2,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): boolean | void {
                me.send_room('<hiy>$N深深地吸一口气，真力迸发，发出一声惊天动地的巨吼！</hiy>');
                const list: CHARACTER[] = me.get_nearby_enemies();
                if (!list.length) return false;
                const dmg: number = int(me.max_mp * 0.15);
                const time: number = 7000;
                for (let i: number = 0; i < list.length; i++) {
                    const x: CHARACTER = list[i];
                    x.notify('你觉得眼前一阵金星乱冒，耳朵痛得像是要裂开一样。');
                    x.damage(dmg);
                    if (x.mp < me.max_mp) {
                        x.add_status({
                            id: 'faint',
                            is_faint: true,
                            duration: time,
                            name: '昏迷',
                            downside: true,
                            finish_msg: '<hiy>慢慢的$N又恢复了知觉……</hiy>\n',
                            start_msg: '<hir>$N只觉得眼前一黑，接着什么都不知道了……</hir>\n',
                        });
                    }
                    me.end_attack(x);
                }
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const dmg: number = int(me.max_mp * 0.15);
                return (
                    '深深地吸一口气，真力迸发，发出一声惊天动地的巨吼，对附近敌人造成你最大内力15%(' +
                    dmg +
                    ')的伤害，如果敌人当前内力小于你最大内力将昏迷7秒。'
                );
            },
        },
        zhao: {
            name: '金刚罩',
            distime: 45000,
            enable_skill: 'force',
            mp: 20,
            use_type: 2,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                me.send_room('<hiy>$N高呼佛号，全身真气鼓动，犹如金铸之钟，坚不可摧。</hiy>');
                me.add_status({
                    id: 'force',
                    name: '金刚罩',
                    desc: '大幅减少你受到的伤害',
                    duration: 10000,
                    prop: {
                        diff_sh_per2: 60,
                    },
                    finish_msg: '$N的金刚罩渐渐消散，真气收回丹田。',
                });
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                return '大幅减少你受到的伤害，10秒内增加60%伤害减免。';
            },
        },
    };
}
