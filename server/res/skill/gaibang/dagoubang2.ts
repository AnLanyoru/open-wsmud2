import { SKILL, PERFORM } from '../../../core/skill/skill.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { PerformData, EnablePropMap } from '../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../core/char/character.js';

/**
 * 打狗棒法进阶 — 完善度90
 *
 * 数据来源：正式服 checkskill dagoubang2
 */
export default class extends SKILL {
    name = '打狗棒';
    id = 'dagoubang2';
    source_skill = 'dagoubang';
    grade = 5;
    family = FAMILIES.GAIBANG;
    desc = '丐帮的打狗棒法，变化精微，招术奇妙，乃丐帮镇帮之宝';
    can_enables = ['club'];
    attack_actions = SKILL.get('dagoubang')?.attack_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            club: {
                gj: 100 + lv * 2,
                mz: lv * 2,
                con: int(lv * 0.2),
                str: int(lv * 0.2),
            },
        };
    }

    pfm_set: PerformData = {
        chan: {
            name: '绊字决',
            distime: 20000,
            enable_skill: 'club',
            mp: 20,
            release_time: 1000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const sh = me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    attack_msg:
                        '<hiw>$N将手中$W往地上一点，棒身借势弹起，使出一招「绊字诀」，棒头如灵蛇出洞，连绵不绝地挑向$n小腿与脚踝。</hiw>',
                });
                if (sh) {
                    const busyTime = chanBusyTime(lv);
                    const dsReduce = chanDsReduce(lv);
                    target.add_status(
                        {
                            id: 'busy',
                            name: '绊倒',
                            duration: busyTime,
                            is_busy: true,
                            downside: true,
                            prop: {
                                ds_per: -dsReduce,
                            },
                            desc: '你被绊字诀所困，步履蹒跚，难以行动。',
                        },
                        me,
                    );
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const t = chanBusyTime(lv);
                const ds = chanDsReduce(lv);
                return '攻击敌方下路，命中后使对方忙乱' + toSec(t) + '秒，并减低躲闪' + ds + '%。';
            },
        },
        wu: {
            name: '天下无狗',
            distime: 20000,
            enable_skill: 'club',
            mp: 20,
            attack_msgs: [
                '<hiw>$N使出一招「棒打双犬」，手中$W化作两道青光砸向$n的$l</hiw>',
                '<hiw>$N手中$W左右晃动，一招「拨草寻蛇」向$n的$l攻去</hiw>',
                '<hiw>$N举起$W，居高临下使一招「打草惊蛇」敲向$n的$l</hiw>',
                '<hiw>$N施出「拨狗朝天」，$W由下往上向$n撩去</hiw>',
            ],
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const count = wuCount(lv);
                const self = this as PERFORM;
                me.send_room(
                    '<hiw>$N手中青光一闪，响起阵阵风声，手中$W犹若千百根相似，层层叠叠将$n笼罩。</hiw>\n',
                    target,
                );
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
                if (hits > 0) {
                    this.change_distime(me, 'club', -(hits * 1000));
                }
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const count = wuCount(lv);
                return '快速对敌人攻击' + count + '次，每命中一次减少天下无狗的冷却时间 1 秒。';
            },
        },
    };
}

// 共享计算函数 — 保证 query_desc 与实际效果一致性

/** 绊字诀：忙乱时间 (ms) */
function chanBusyTime(lv: number): number {
    const t = 3000 + lv * 5;
    if (t > 13000) return 13000;
    return t;
}

/** 绊字诀：躲闪降低百分比 */
function chanDsReduce(lv: number): number {
    return 10 + int(lv / 100);
}

/** 天下无狗：攻击次数 */
function wuCount(lv: number): number {
    const c = 3 + int(lv / 300);
    if (c > 10) return 10;
    return c;
}
