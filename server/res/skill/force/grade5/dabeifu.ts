import { SKILL } from '../../../../core/skill/skill.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER } from '../../../../core/char/character.js';

export default class extends SKILL {
    name = '天地交征阴阳大悲赋';
    id = 'dabeifu';
    grade = 5;
    force_rad = 1.0;
    is_hidden = true;
    desc =
        '阴邪诡异的绝学，相传融汇天地间至阴至邪之力，' +
        '修炼者需断情绝欲，引天地交征之力入体，化阴阳为杀伐。' +
        '功法之邪，可移穴换位，搜魂夺魄。';
    can_enables = ['force'];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                con: 5 + lv * 2,
                diff_bj: 5 + Math.floor(lv / 300),
                diff_downside_per: 15,
                expend_mp_per: 15,
                limit_mp: lv * 290,
                desc: '唯一：将你内力的100%转化为气血',
            },
        };
    }

    pfm_set: PerformData = {
        souhun: {
            name: '搜魂手',
            distime: 45000,
            enable_skill: 'force',
            mp: 20,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                me.send_room(
                    '<hio>$N五指箕张，指尖萦绕着幽幽青芒，一招「搜魂手」挟带阴风直取$n周身要穴！</hio>\n',
                    target,
                );
                const sh = me.do_attack({
                    target,
                    gj: me.gj,
                    mz: me.mz,
                });
                if (sh > 0 && target && target.hp > 0) {
                    const duration = souhun_debuff_duration(lv);
                    const per = souhun_reduce_per(lv);
                    target.add_status(
                        {
                            id: 'sou',
                            name: '搜魂',
                            downside: true,
                            duration: duration,
                            desc: '被搜魂手所伤，战斗属性下降',
                            prop: {
                                gj_per: -per,
                                mz_per: -per,
                                ds_per: -per,
                            },
                            finish_msg: '$N感到体内那股阴冷的搜魂劲气缓缓消散，经脉重新通畅。',
                        },
                        me,
                    );
                    // 吸收气血
                    const heal = Math.floor(sh * 0.3);
                    if (heal > 0) {
                        me.add_hp(heal);
                        me.send_room(
                            '<hio>$N掌心回吸，一缕缕血气自$n伤口飘出，被$N吸入体内！</hio>\n',
                            target,
                        );
                    }
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const per = souhun_reduce_per(lv);
                const duration = toSec(souhun_debuff_duration(lv));
                return (
                    '攻击敌人，命中后降低对方' +
                    per +
                    '%的攻击、命中、躲闪，持续' +
                    duration +
                    '，并吸收部分伤害转化为自身气血'
                );
            },
        },
        yixue: {
            name: '移穴法',
            distime: 60000,
            enable_skill: 'force',
            mp: 120,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = yixue_duration(lv);
                me.send_room(
                    '<hio>$N暗运移穴换位之法，真气逆转，周身穴道若有若无，飘忽不定！</hio>\n',
                );
                me.add_status({
                    id: 'force',
                    name: '移穴',
                    duration: duration,
                    ig_control: true,
                    desc: '移穴换位，免疫控制',
                    start_msg: '<hio>$N经脉逆转，诸般控制手段对$P全然无效！</hio>',
                    finish_msg: '$N真气归位，周身移位穴道缓缓复原，经脉流转如初。',
                });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const duration = toSec(yixue_duration(lv));
                return '移穴换位，' + duration + '内免疫控制';
            },
        },
    };
}

// ═══════════════════════════════════════════
// 天地交征阴阳大悲赋 — 公共计算函数
// ═══════════════════════════════════════════

/** 搜魂手 debuff 持续时间（毫秒）：5000+lv*5，封顶15000 */
function souhun_debuff_duration(lv: number): number {
    return Math.min(15000, 5000 + lv * 5);
}

/** 搜魂手降低属性百分比：3+floor(lv/100)，封顶50 */
function souhun_reduce_per(lv: number): number {
    return Math.min(50, 3 + Math.floor(lv / 100));
}

/** 移穴法持续时间（毫秒）：10000+lv*10，封顶15000 */
function yixue_duration(lv: number): number {
    return Math.min(15000, 10000 + lv * 10);
}
