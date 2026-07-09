import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import { SKILL_TYPES, WEAPON_TYPE } from '../../../../core/const.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';
import type { LearnCondition } from '../../../../types/events.js';

/** 完成度 50 */
export default class extends SKILL {
    name = '辟邪剑法';
    id = 'bixiejianfa';
    grade = 5;

    // 原始描述：渡元禅师从葵花宝典残本中领悟出来的一套剑法，迅捷诡异，剑出如电，令人防不胜防。
    desc = '渡元禅师从葵花宝典残本中领悟出来的一套剑法，迅捷诡异';
    can_enables = ['sword', 'parry'];
    attack_actions = [
        '$N身形如鬼魅般一闪，$w快如电光石火，一招「<RED>鬼影重重</RED>」骤然刺向$n的$l',
        '$N身形忽隐忽现，$w自不可思议的角度刺出，正是「<MAG>邪光乍现</MAG>」直取$n',
        '$N$w一抖，化作万点寒星，一招「<HIR>血影迷踪</HIR>」铺天盖地罩向$n',
        '$N身形急速旋转，$w化作一道血色匹练，正是「<RED>魔影随行</RED>」卷向$n的$l',
        '$N忽地欺近$n身前，$w以一个诡异的角度刺出，一招「<HIM>鬼哭神嚎</HIM>」直取$n要害',
        '$N身影一分为二，从左右同时攻至，正是「<MAG>魅影双杀</MAG>」，剑光交错斩向$n',
        '$N冷笑一声，$w似左实右，一招「<HIR>血光之灾</HIR>」如毒蛇吐信般刺向$n的$l',
        '$N$w疾挥，化作一张血色剑网，正是「<RED>天罗血网</RED>」，铺天盖地罩向$n',
    ];
    parry_actions = [
        '$n身形如电，$w后发先至，以诡异的角度刺向$P手腕，迫使其收招自保\n',
        '$n$w急抖，幻出数朵剑花，正是「<MAG>镜花水月</MAG>」，虚实难辨间化解了$P的攻势\n',
        '$n身形忽然后仰，$w自下而上撩出，以一个不可能的角度反攻$P的$l\n',
        '$n如鬼魅般一晃，竟在间不容发之际避过$P的杀招，$w顺势反击\n',
    ];
    learn_condition: LearnCondition = {
        dex1: 50,
        max_mp: 30000,
        skill: {
            sword: 400,
        },
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + lv * 2,
                mz: 20 + Math.floor(lv * 1.5),
                dex: Math.floor(lv * 0.127),
                bj_per: 8,
                desc: '你的攻击会快速攻击多次',
            },
            parry: {
                zj: 10 + Math.floor(lv * 2.3),
                diff_sh_per: 4,
                dex: Math.floor(lv * 0.127),
            },
        };
    }

    pfm_set: PerformData = {
        ci: {
            name: '刺目',
            distime: 45000,
            enable_skill: 'sword',
            mp: 20,
            release_time: 3000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var time = calcCimuTime(lv);
                var sh = me.do_attack({
                    target: target,
                    attack_msg:
                        '<red>$N身形一晃，骤然消失在$n眼前，下一刻已出现在$n面前，$w直刺$n双目！</red>',
                    miss_msg:
                        '<cyn>$n虽未看清$N的身法，但直觉不妙，猛地向后一仰，堪堪避过这致命一剑。</cyn>',
                    damage_msg:
                        '<hir>$n只觉眼前寒光一闪，$w已刺中双目，鲜血飞溅，视线一片模糊！</hir>',
                });
                if (sh) {
                    target.add_status(
                        {
                            id: 'shiming',
                            name: '失明',
                            duration: time,
                            downside: true,
                            prop: {
                                mz_per: -100,
                                ds_per: -100,
                            },
                            desc: '双目被刺，无法视物，无法命中与躲闪',
                        },
                        me,
                    );
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                var time = calcCimuTime(lv);
                return (
                    '快速出剑，攻击敌方双目，刺中后必定暴击，使敌人在' +
                    toSec(int(time)) +
                    '秒内处于失明状态，无法躲闪，无法命中敌人。'
                );
            },
        },
    };
}

function calcCimuTime(lv: number): number {
    const t = 4000 + Math.floor(lv * 9);
    if (t > 13000) return 13000;
    return t;
}
