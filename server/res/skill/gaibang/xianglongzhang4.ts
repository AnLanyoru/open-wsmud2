import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PropMap, PerformData, EnablePropMap} from "../../../core/skill/skill.js";
import type {CHARACTER, DoAttackPar} from "../../../core/char/character.js";

/**
 * 降龙掌 — 尝试完善的未完善技能
 *
 * 数据来源：正式服 checkskill xianglongzhang4
 */

// 共享计算函数 — 保证 query_desc 与实际效果一致性

/** 降龙：debuff 持续时间 (ms) */
function qiDebuffTime(_lv: number): number {
    return 5000; // 短时间 = 5秒
}

/** 破灭：消耗内力百分比 */
function poMpPercent(lv: number): number {
    return Math.min(30, 10 + Math.floor(lv / 100));
}

/** 摧毁层数阈值 */
const DESTROY_THRESHOLD = 3;

/** 获取目标身上的摧毁层数 */
function getDestroyCount(target: CHARACTER): number {
    return target.query_temp("xlz4_ch", 0);
}

/** 对目标施加一层摧毁 */
function addDestroyStack(target: CHARACTER, from: CHARACTER): void {
    const count = getDestroyCount(target) + 1;
    const duration = 30000; // 30秒持续时间
    target.set_temp("xlz4_ch", count, duration);
    // 每层摧毁降低防御
    target.add_status({
        id: "xlz4_destroy",
        name: "瓦解",
        duration: duration,
        downside: true,
        override: 1,
        count: count,
        max_count: 10,
        prop: {
            fy_per: -2 * count,
            diff_sh_per: -2 * count,
        },
        desc: "降龙掌劲正逐步瓦解你的防御，防御降低" + (2 * count) + "%。",
    }, from);
}

export default class extends SKILL {
    name = "降龙掌";
    id = "xianglongzhang4";
    grade = 6;
    family = FAMILIES.GAIBANG;
    is_ultimate = true;
    desc = "上古墨门以此功法义行天下，战神不败";
    can_enables = ["unarmed"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];

    slots = [
        {
            prop: "xlz4_po",
            value: (_lv: number) => 10,
            format: (_val: number) => "破灭额外消耗10%内力，伤害提升20%",
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: lv * 3,
                mz: lv * 3,
                str: lv * 1,
                con: lv * 1,
                gj_per: 5 + Math.floor(lv / 200),
                desc: "摧毁命中敌人后逐步瓦解敌方防御",
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
            name: "降龙",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 1450,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const destroyCount = getDestroyCount(target);
                const sh = me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    no_weapon: true,
                    attack_msg: "<ord>$N龙行虎步，掌随身走，周身真气如烈焰翻腾，猛然一掌拍出——掌风中隐现龙形，昂首怒啸，直贯$n而去！</ord>",
                    damage_msg: "<ored>只听一声惊天动地的龙吟，$N掌力已印在$n身上，劲力如怒潮般一浪接一浪涌入$n体内！</ored>",
                    miss_msg: "<cyn>$n眼见$N掌力来势不可挡，身形急闪，以毫厘之差堪堪避过这惊天一掌。</cyn>",
                });
                if (sh) {
                    const debuffTime = qiDebuffTime(lv);
                    // 施加无法移动（busy）和无法防御（busy已包含）
                    target.add_status({
                        id: "xlz4_qi",
                        name: "降龙镇",
                        duration: debuffTime,
                        downside: true,
                        is_busy: true,
                        is_rash: true,
                        desc: "被降龙掌镇住，无法移动，无法防御与躲闪。",
                    }, me);
                    // 摧毁级别大于3则昏迷
                    if (destroyCount >= DESTROY_THRESHOLD) {
                        target.add_status({
                            id: "xlz4_faint",
                            name: "昏迷",
                            duration: 3000,
                            downside: true,
                            is_faint: true,
                            desc: "降龙掌劲摧毁了你的防御，你陷入了昏迷。",
                        }, me);
                        me.send_room("<ored>$n的防御被彻底瓦解，眼前一黑，失去了知觉！</ored>", target);
                    }
                    // 命中后叠加一层摧毁
                    addDestroyStack(target, me);
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                return "命中后使敌人短时间内无法移动，无法防御，如果摧毁级别大于" + DESTROY_THRESHOLD + "则昏迷。";
            },
        },
        po: {
            name: "破灭",
            distime: 30000,
            enable_skill: "unarmed",
            mp: 2300,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const destroyCount = getDestroyCount(target);
                const mpPercent = poMpPercent(lv);
                const slotExtra = me.query_prop("xlz4_po");
                const totalMpPercent = mpPercent + slotExtra;
                const powerGj = Math.floor(me.max_mp * totalMpPercent / 100);

                me.send_room("<ored>$N面容肃穆，双掌缓缓合拢，周身真气如百川归海般向掌心汇聚。刹那间，数十式掌法合为一体——$N猛地双掌齐出，一道毁天灭地的掌劲轰然爆发！</ored>", target);

                const sh = me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    no_weapon: true,
                    power_gj: powerGj,
                    attack_msg: "<ored>$N将毕生功力聚于一掌，掌劲如山崩海啸般向$n席卷而去！</ored>",
                    damage_msg: "<ored>「破灭」！$N毁天灭地的一掌正中$n，劲力贯体而过，$n身后的地面被余劲震出数丈宽的深坑！</ored>",
                    miss_msg: "<cyn>$n拼尽全力向旁闪避，破灭掌劲擦身而过，身后的墙壁轰然倒塌！</cyn>",
                });

                if (sh) {
                    // 降低对方气血上限
                    const hpReduce = Math.floor(target.max_hp * 0.15);
                    target.add_status({
                        id: "xlz4_po_hp",
                        name: "气衰",
                        duration: 30000,
                        downside: true,
                        prop: {
                            max_hp: -hpReduce,
                        },
                        desc: "被破灭掌劲所伤，气血上限降低。",
                    }, me);

                    // 摧毁级别大于3则完全瓦解对方防御
                    if (destroyCount >= DESTROY_THRESHOLD) {
                        target.add_status({
                            id: "xlz4_break",
                            name: "瓦解",
                            duration: 10000,
                            downside: true,
                            prop: {
                                diff_fy_per: 100,
                                fy_per: -50,
                            },
                            desc: "防御被完全瓦解，无法抵御任何攻击。",
                        }, me);
                        me.send_room("<ored>$n的防御被彻底瓦解，门户大开，再无抵御之力！</ored>", target);
                    }
                    // 命中后叠加摧毁层数
                    addDestroyStack(target, me);
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                return "耗费大量内力将数十式掌法合为一式瞬间打出，对敌人造成大量伤害，并降低对方的气血上限，如果摧毁级别大于" + DESTROY_THRESHOLD + "则完全瓦解对方防御。";
            },
        },
    };
}
