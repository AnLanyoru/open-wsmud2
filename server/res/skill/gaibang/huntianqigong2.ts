import { SKILL } from '../../../core/skill/skill.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { PerformData, EnablePropMap } from '../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../core/char/character.js';

/**
 * 混元天罡 — 完善度90
 *
 * 数据来源：正式服 checkskill huntianqigong2
 */
export default class extends SKILL {
    name = '混元天罡';
    id = 'huntianqigong2';
    source_skill = 'huntianqigong';
    grade = 4;
    family = FAMILIES.GAIBANG;
    desc = '丐帮的高级心法，以混元一气为根基，凝聚护体天罡，坚不可摧';
    can_enables = ['force'];
    force_rad = 0.7;

    slots = [
        {
            prop: 'htqg_nl',
            value: (_lv: number) => 120000,
            format: (_val: number) => '内力上限：+120000',
        },
        {
            prop: 'htqg_tg',
            value: (_lv: number) => 20,
            format: (_val: number) => '天罡的效果增加20%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: 20 + lv * 2,
                con: 4 + int(lv * 0.25),
                fy: 30 + lv * 2,
                limit_mp: lv * 158,
                desc: '唯一：将你内力的70%转化为气血',
            },
        };
    }

    pfm_set: PerformData = {
        tian: {
            name: '天罡',
            distime: 45000,
            enable_skill: 'force',
            mp: 20,
            release_time: 0,
            use_type: 2,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = tianDuration(lv);
                const baseProp = tianBaseProp(lv);
                const enhance = 1 + me.query_prop('htqg_tg') / 100;
                const prop = int(baseProp * enhance);

                me.send_room(
                    '<HIY>$N深吸一口气，将混元真气催至极致，周身真气翻涌鼓荡，衣衫猎猎作响，一道无形罡气笼罩全身，赫然已是混元天罡护体之境！</HIY>',
                );
                me.add_status({
                    id: 'force',
                    name: '天罡',
                    desc: '混元天罡护体，攻防一体',
                    duration: duration,
                    prop: {
                        gj_per: prop,
                        diff_sh_per2: prop,
                    },
                    start_msg: '<HIY>$N周身罡气流转，如金刚怒目，凛然不可侵犯。</HIY>',
                    finish_msg: '<hiw>$N周身罡气渐渐消散，混元天罡之势已收。</hiw>',
                });
                me.reauto_attack();
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const duration = tianDuration(lv);
                const baseProp = tianBaseProp(lv);
                const enhance = 1 + me.query_prop('htqg_tg') / 100;
                const prop = int(baseProp * enhance);
                return toSec(duration) + '秒内提升自身攻击免伤' + prop + '%。';
            },
        },
    };
}

// 共享计算函数 — 保证 query_desc 与实际效果一致性

/** 天罡：持续时间 (ms) */
function tianDuration(lv: number): number {
    const t = 10000 + lv * 10;
    if (t > 15000) return 15000;
    return t;
}

/** 天罡：攻击免伤百分比（基础值，未计算进阶加成） */
function tianBaseProp(lv: number): number {
    const p = 10 + int(lv / 100);
    if (p > 40) return 40;
    return p;
}
