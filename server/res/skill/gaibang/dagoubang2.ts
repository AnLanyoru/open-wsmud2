import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap} from "../../../core/skill/skill.js";
import type {CHARACTER, DoAttackPar} from "../../../core/char/character.js";

/**
 * 打狗棒法进阶 — 尝试完善的未完善技能
 *
 * 数据来源：正式服 checkskill dagoubang2
 */

// 共享计算函数 — 保证 query_desc 与实际效果一致性

/** 绊字诀：忙乱时间 (ms) */
function chanBusyTime(lv: number): number {
    const t = 3000 + lv * 5;
    if (t > 13000) return 13000;
    return t;
}

/** 绊字诀：躲闪降低百分比 */
function chanDsReduce(lv: number): number {
    return 10 + Math.floor(lv / 100);
}

/** 天下无狗：攻击次数 */
function wuCount(lv: number): number {
    const c = 3 + Math.floor(lv / 300);
    if (c > 10) return 10;
    return c;
}

export default class extends SKILL {
    name = "打狗棒";
    id = "dagoubang2";
    source_skill = "dagoubang";
    grade = 5;
    family = FAMILIES.GAIBANG;
    desc = "丐帮的打狗棒法，变化精微，招术奇妙，乃丐帮镇帮之宝";
    can_enables = ["club"];
    attack_actions = SKILL.get("club")?.attack_actions || [];

    slots = [
        {
            prop: "dgb_cd",
            value: (lv: number) => 10,
            format: (val: number) => "天下无狗每命中一次额外减少冷却" + val / 10 + "秒",
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            club: {
                gj: 100 + lv * 2,
                mz: lv * 2,
                con: Math.floor(lv * 0.2),
                str: Math.floor(lv * 0.2),
            },
        };
    }

    pfm_set: PerformData = {
        chan: {
            name: "绊字决",
            distime: 20000,
            enable_skill: "club",
            mp: 20,
            release_time: 1000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const sh = me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    attack_msg: "<hiw>$N将手中$W往地上一点，棒身借势弹起，使出一招「绊字诀」，棒头如灵蛇出洞，连绵不绝地挑向$n小腿与脚踝。</hiw>",
                });
                if (sh) {
                    const busyTime = chanBusyTime(lv);
                    const dsReduce = chanDsReduce(lv);
                    target.add_status({
                        id: "busy",
                        name: "绊倒",
                        duration: busyTime,
                        is_busy: true,
                        downside: true,
                        prop: {
                            ds_per: -dsReduce,
                        },
                        desc: "你被绊字诀所困，步履蹒跚，难以行动。",
                    }, me);
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const t = chanBusyTime(lv);
                const ds = chanDsReduce(lv);
                return "攻击敌方下路，命中后使对方忙乱" + toSec(t) + "秒，并减低躲闪" + ds + "%。";
            },
        },
        wu: {
            name: "天下无狗",
            distime: 20000,
            enable_skill: "club",
            mp: 20,
            release_time: 4000,
            attack_msgs: [
                "<hiw>$N使出一招「棒打双犬」，手中$W快如流星，化作两道青光砸向$n的$l。</hiw>",
                "<hiw>$N手腕急抖，一式「拨草寻蛇」，$W从不可思议的角度斜挑$n的$l。</hiw>",
                "<hiw>$N纵身跃起，居高临下使出「打草惊蛇」，$W带着破空之声劈向$n的$l。</hiw>",
                "<hiw>$N身子一矮，反手施出「拨狗朝天」，$W自下而上疾撩$n的$l。</hiw>",
            ],
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const count = wuCount(lv);
                const self = this as PERFORM;
                me.send_room("<hiw>$N手中$W青光一闪，霎时间棒影重重，四面八方尽是棒风，宛如" + count + "根打狗棒同时攻至，将$n笼罩在一片碧光之中。</hiw>\n", target);
                const cdReduce = me.query_prop("dgb_cd") / 10;
                let hits = 0;
                for (let i = 0; i < count; i++) {
                    const hit = me.do_attack({
                        target: target,
                        gj: me.gj,
                        mz: me.mz,
                        attack_msg: self.attack_msgs!.random(),
                    });
                    if (hit) hits++;
                }
                me.end_attack(target);
                // 每命中一次减少冷却时间
                if (hits > 0 && cdReduce > 0) {
                    self.change_distime(me, "club", -(hits * cdReduce * 1000));
                }
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const count = wuCount(lv);
                return "快速对敌人攻击" + count + "次，每命中一次减少天下无狗的冷却时间。";
            },
        },
    };
}
