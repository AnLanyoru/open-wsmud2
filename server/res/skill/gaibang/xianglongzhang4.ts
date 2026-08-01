import { SKILL, PERFORM } from '../../../core/skill/skill.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { PerformData, EnablePropMap } from '../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../core/char/character.js';
import { PropMap } from '../../../types/props.js';

/**
 * 降龙掌 — 完善度80
 *
 * 数据来源：正式服 checkskill xianglongzhang4
 */
export default class extends SKILL {
    name = '降龙掌';
    id = 'xianglongzhang4';
    grade = 6;
    family = FAMILIES.GAIBANG;
    is_ultimate = true;
    desc = '上古墨门以此功法义行天下，战神不败';
    can_enables = ['unarmed'];
    attack_actions = [
        '$N双掌一分，左掌封尽八方退路、右掌直捣黄龙，无所不覆，罩向$n的$l',
        '$N踏步上前，掌含千钧之力，一声叱咤震得四野嗡鸣，劈山裂石般一掌拍向$n的$l',
        '$N掌起处罡风如刀，一声断喝：「义者，正也！」掌挟风雷之势直取$n的$l',
        '$N踏步欺身，掌劲含而不吐、发若惊雷，一招之间已将$n退路尽数封死，推向$n的$l',
        '$N双臂疾振，左掌虚引、右掌后发先至，双掌一前一後如巨锤贯顶，罩向$n的$l',
        '$N沉腰坐马，单掌自胁下翻出，其势刚猛无俦，大有一去不返之气概，击向$n的$l',
        '$N气贯双臂，连环拍出数掌，一掌重过一掌，掌影如山崩岳摧压向$n的$l',
        '$N身形凝立如松，右掌缓缓推出，掌至中途蓦地加速，劲力排山倒海般涌向$n的$l',
        '$N一声长啸，双掌齐出，怒喝：「赴汤蹈火，死不旋踵！」掌风所至草木摧折，直贯$n的$l',
        '$N足踏中宫，掌含千钧之力当头拍落，罡风激荡间龙吟隐隐，一掌拍向$n的$l',
    ];

    slots = [
        {
            prop: 'xlz4_po',
            value: (_lv: number) => 10,
            format: (_val: number) => '破灭额外消耗10%内力，伤害提升20%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: lv * 3,
                mz: lv * 3,
                str: lv * 1,
                con: lv * 1,
                gj_per: 5 + int(lv / 200),
                desc: '摧毁：命中敌人后逐步瓦解敌方防御',
            },
        };
    }

    // 攻击命中时叠加摧毁层数
    on_attack_over(me: CHARACTER, target: CHARACTER, par: DoAttackPar, sh: number): void {
        if (sh > 0 && target) {
            addDestroyStack(target, me);
        }
    }

    pfm_set: PerformData = {
        qi: {
            name: '降龙',
            distime: 30000,
            enable_skill: 'unarmed',
            mp: 1450,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const destroyCount = getDestroyCount(target);
                const hasXlz = target.query_status('xlz') > 0;
                const sh = me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    no_weapon: true,
                    diff_fy: hasXlz ? 100 : 0,
                    no_dodge: hasXlz ? true : false,
                    no_parry: hasXlz ? true : false,
                    attack_msg:
                        '<ord>$N龙行虎步，掌随身走，周身真气如烈焰翻腾，猛然一掌拍出——掌风中隐现龙形，昂首怒啸，直贯$n而去！</ord>',
                    damage_msg:
                        '<ored>只听一声惊天动地的龙吟，$N掌力已印在$n身上，劲力如怒潮般一浪接一浪涌入$n体内！</ored>',
                    miss_msg:
                        '<cyn>$n眼见$N掌力来势不可挡，身形急闪，以毫厘之差堪堪避过这惊天一掌。</cyn>',
                });
                if (sh) {
                    const debuffTime = qiDebuffTime(lv);
                    // 施加无法移动（busy）和无法防御（busy已包含）
                    target.add_status(
                        {
                            id: 'xlz',
                            name: '降龙',
                            duration: debuffTime,
                            downside: true,
                            is_rash: true,
                            desc: '被降龙掌镇住，无法移动，无法防御与躲闪。',
                        },
                        me,
                    );
                    // 摧毁级别大于3则昏迷
                    if (destroyCount >= DESTROY_THRESHOLD) {
                        target.add_status(
                            {
                                id: 'faint',
                                name: '昏迷',
                                duration: 10000,
                                downside: true,
                                is_faint: true,
                                desc: '降龙掌劲摧毁了防御，陷入了昏迷。',
                            },
                            me,
                        );
                        me.send_room(
                            '<ored>$n的防御被彻底瓦解，眼前一黑，失去了知觉！</ored>',
                            target,
                        );
                    }
                    // 命中后叠加一层摧毁
                    addDestroyStack(target, me);
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                return (
                    '命中后使敌人短时间内无法移动，无法防御，如果摧毁级别大于' +
                    DESTROY_THRESHOLD +
                    '则昏迷。'
                );
            },
        },
        po: {
            name: '破灭',
            distime: 30000,
            enable_skill: 'unarmed',
            mp: 2300,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const destroyCount = getDestroyCount(target);
                const hasXlz = target.query_status('xlz') > 0;
                const mpPercent = poMpPercent(lv);
                const slotExtra = me.query_prop('xlz4_po');
                const totalMpPercent = mpPercent + slotExtra;
                const powerGj = int((me.max_mp * totalMpPercent) / 100);

                me.send_room(
                    '<hir>$N面容肃穆，双掌缓缓合拢，周身真气如百川归海般向掌心汇聚，猛地双掌齐出，一道毁天灭地的掌劲轰然爆发！</hir>',
                    target,
                );

                const sh = me.do_attack({
                    target: target,
                    gj: me.gj * (lv/200 + 5),
                    mz: me.mz,
                    no_weapon: true,
                    diff_fy: hasXlz ? 100 : 0,
                    no_dodge: hasXlz ? true : false,
                    no_parry: hasXlz ? true : false,
                    power_gj: powerGj,
                    miss_msg:
                        '<cyn>$n拼尽全力向旁闪避，破灭掌劲擦身而过，身后的墙壁轰然倒塌！</cyn>',
                });

                if (sh) {
                    // 降低对方气血上限
                    const hpReduce = int(target.max_hp * 0.15);

                    const prop: PropMap = {
                        max_hp: -hpReduce,
                    };

                    // 摧毁级别大于3则完全瓦解对方防御
                    if (destroyCount >= DESTROY_THRESHOLD) {
                        prop.diff_fy_per2 = -100;
                        prop.fy_per = -100;
                        me.send_room(
                            '<ored>$n的防御被彻底瓦解，门户大开，再无抵御之力！</ored>',
                            target,
                        );
                    }
                    // 命中后叠加摧毁层数
                    addDestroyStack(target, me);
                    target.add_status(
                        {
                            id: 'pomie',
                            name: '破灭',
                            duration: 30000,
                            downside: true,
                            prop,
                            desc: '被破灭掌劲所伤，气血上限降低。',
                        },
                        me,
                    );
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                return (
                    '耗费大量内力将数十式掌法合为一式瞬间打出，对敌人造成大量伤害，并降低对方的气血上限，如果摧毁级别大于' +
                    DESTROY_THRESHOLD +
                    '则完全瓦解对方防御。'
                );
            },
        },
    };
}

// 共享计算函数 — 保证 query_desc 与实际效果一致性

/** 降龙：debuff 持续时间 (ms) */
function qiDebuffTime(_lv: number): number {
    return 5000;
}

/** 破灭：消耗内力百分比 */
function poMpPercent(lv: number): number {
    return Math.min(30, 10 + int(lv / 100));
}

/** 摧毁层数阈值 */
const DESTROY_THRESHOLD = 3;

/** 获取目标身上的摧毁层数 */
function getDestroyCount(target: CHARACTER): number {
    return target.query_status('pofang');
}

/** 对目标施加一层摧毁 */
function addDestroyStack(target: CHARACTER, from: CHARACTER): void {
    const count = getDestroyCount(target) + 1;
    const duration = 30000;
    target.add_status(
        {
            id: 'pofang',
            name: '瓦解',
            duration: duration,
            downside: true,
            override: 1,
            count: count,
            max_count: 10,
            prop: {
                fy_per: -2 * count,
                diff_sh_per: -2 * count,
            },
            desc: '降龙掌劲正逐步瓦解你的防御，防御降低',
        },
        from,
    );
}
