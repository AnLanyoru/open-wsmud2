import { SKILL } from '../../../core/skill/skill.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { PropMap } from '../../../types/props.js';
import type { PerformData, EnablePropMap } from '../../../core/skill/skill.js';
import type { LearnCondition } from '../../../types/events.js';
import type { CHARACTER } from '../../../core/char/character.js';

export default class extends SKILL {
    name = '凌波微步';
    id = 'lingboweibu2';
    source_skill = 'lingboweibu';
    grade = 5;
    family = FAMILIES.XIAOYAO;
    desc = '逍遥派绝世神功，步法精妙如神，飘忽若仙，令敌人难以捕捉。';
    can_enables = ['dodge'];

    dodge_actions = [
        '只见$n施展凌波微步，步法轻盈，仿佛轻云之蔽月，不知怎的就到了数丈之外。\n',
        '$n的身影飘飘兮若流风之回雪，施展的正是凌波微步，$N连$n的衣角都沾不到。\n',
        '但见$n施展凌波微步，左一转，右一斜，就已经绕到了$N的身後。\n',
        '可是$n施展凌波微步，只是轻描淡写地向旁踏出一步，就巧妙地避开了$N的攻势。\n',
        '只见$n身影滴溜溜地一转，体迅飞鸟，飘忽若神，施展的正是凌波微步。\n',
        '$N只觉得眼前一花，头脑发昏，只觉得四面都是$n的身影！\n',
        '$n左脚轻轻地踏出一步，施展凌波微步，若往若返，把$N牵得团团乱转。\n',
    ];

    learn_condition: LearnCondition = {
        max_mp: 8000,
        skill: {
            dodge: 500,
        },
    };

    query_prop(lv: number): PropMap {
        return {
            ds_per: 5 + Math.floor(lv / 300),
        };
    }

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: lv * 2 + 100,
                dex: Math.floor(lv / 2) + 10,
                ds_per: 1 + Math.floor(lv / 200),
            },
        };
    }

    pfm_set: PerformData = {
        lingbo: {
            name: '凌波',
            distime: 40000,
            enable_skill: 'dodge',
            mp: 20,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = get_lingbo_duration(lv, me.ds);

                me.add_status({
                    id: 'dodge',
                    name: '凌波',
                    start_msg:
                        '<him>$N施展凌波微步，神光离合，乍阴乍阳，动无常则，进止难期。</him>',
                    desc: '你施展了凌波微步，使敌人无法命中',
                    duration: duration,
                    on_attach: function (p: CHARACTER): void {
                        p.change_prop({ ds: 1999999 }, true);
                        p.recount();
                    },
                    on_expire: function (p: CHARACTER): void {
                        p.change_prop({ ds: 1999999 }, false);
                        p.recount();
                    },
                });
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const duration = get_lingbo_duration(lv, me.ds);
                return (
                    '全力施展凌波微步，在' +
                    duration / 1000 +
                    '秒(提升躲闪提高持续时间)内绝对躲闪敌方攻击。'
                );
            },
        },
    };
}

/**
 * 计算凌波微步的绝对躲闪持续时间。
 * @param lv  技能等级
 * @param ds  玩家当前躲闪值
 * @returns 持续时间（毫秒）
 */
function get_lingbo_duration(lv: number, ds: number): number {
    let duration = lv * 10;
    if (duration < 3000) duration = 3000;
    else if (duration > 10000) duration = 10000;

    // 躲闪加成：2w 躲闪起，每 1000 躲闪 +25ms，最多 +5s
    if (ds > 20000) {
        const bonus = Math.floor((ds - 20000) / 1000) * 25;
        duration += bonus > 5000 ? 5000 : bonus;
    }

    return duration;
}
