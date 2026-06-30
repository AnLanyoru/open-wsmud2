import { SKILL } from "../../../../core/skill/skill.js";
import type { PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";
// ============================================================
// 血刀
// ============================================================

export default class extends SKILL {
    name = "血刀";
    id = "xuedao";
    grade = 5;

    desc = "血刀门的看家本领，以出招角度刁钻诡异威力强大著称。刀出必饮血，人伤愈狂猛，越是濒死，刀势越烈。";
    can_enables = ["blade"];
    attack_actions = [
        "$N身形一晃，$W自$n视线死角斜撩而上，刀路之诡令人心寒",
        "$N旋身反手，$W划出一道血弧，由下至上倒劈$n的$l",
        "$N欺身直进，$W刀尖微颤，如毒蛇吐信般点向$n的$l",
        "$N踏步沉腰，$W挟腥风拦腰横扫，竟是不留余地的杀招",
        "$N手腕急翻，$W自肘底穿出，从一个绝无可能的角度刺向$n的$l",
        "$N纵身跃起，$W凌空劈落，刀未至而血光已映红$n面庞",
        "$N佯退半步，蓦地拧身突刺，$W如鬼魅般绕开$n守势直取$l",
        "$N刀交左手，右手虚引$n目光，$W已悄然无声斩至$n腰肋",
    ];

    query_enable_prop(lv: number): EnablePropMap {
        const bloodPer = query_xd_blood_per(lv);
        return {
            blade: {
                gj: 200 + lv * 2,
                mz: 200 + lv * 2,
                add_sh_per: Math.floor(lv / 300) + 1,
                desc: `你的气血每降低1%增加${bloodPer}%的伤害`,
            },
        };
    }

    /**
     * 入战时记录当前气血百分比，作为「浴血」加成的基准。
     * 入战血量视为 100%，此后每损失1%气血，伤害增加 (lv/1000+1)%。
     * 被治疗至超过入战百分比时，加成归零——不因回血而产生负收益。
     */
    on_beginfight(me: CHARACTER, _target: CHARACTER): void {
        const entryPercent = Math.floor(me.hp * 100 / me.max_hp);
        me.set_temp("ef_hp", entryPercent);
    }

    /**
     * 血刀被动——「浴血」：入战以来损失越多，杀意越盛。
     */
    on_attack(me: CHARACTER, target: CHARACTER, par: DoAttackPar): number {
        const lv = me.query_skill("xuedao", 0);
        if (lv <= 0) return 0;
        let entryPercent = me.query_temp("ef_hp", Number(100));
        const curPercent = Math.floor(me.hp * 100 / me.max_hp);
        if (curPercent > entryPercent) {
            me.set_temp("ef_hp", curPercent);
            return 0
        }
        const lostPercent = entryPercent - curPercent;
        const bloodPer = query_xd_blood_per(lv);
        const extraRatio = lostPercent / entryPercent * bloodPer;
        return Math.floor(me.gj * extraRatio);
    }

    /**
     * 嗜血状态下，每刀反噬自身1%当前气血。
     */
    on_attack_over(me: CHARACTER, target: CHARACTER, par: DoAttackPar, sh: number): void {
        if (me.query_status("weapon")) {
            const hpCost = Math.max(1, Math.floor(me.hp * 0.01));
            me.add_hp(-hpCost);
        }
    }

    pfm_set: PerformData = {
        shi: {
            name: "嗜血",
            distime: 60000,
            enable_skill: "blade",
            mp: 20,
            release_time: 500,
            query_mp: function (me: CHARACTER, lv: number): number {
                return query_xd_shixue_mp(lv);
            },
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = query_xd_shixue_duration(lv);
                const bonus = query_xd_shixue_bonus(lv);

                me.send_room(
                    "<hio>$N咬破舌尖，一口精血喷于$W之上，霎时刀身血芒暴涨，映得$N须眉皆赤，眼中再无半分理智！</hio>",
                    target,
                );

                me.add_status({
                    id: "weapon",
                    name: "嗜血",
                    desc: `刀饮血而愈利，人失血而愈狂，然每刀劈出，自身亦为刀煞反噬`,
                    duration: duration,
                    override: 0,
                    prop: {
                        gj_per: bonus,
                        mz_per: bonus,
                        gjsd_per: bonus,
                    },
                    finish_msg: "$N周身翻涌的血气渐渐沉寂，$W上的血芒一丝丝褪去，终归于鞘。",
                });

                me.reauto_attack();
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const duration = query_xd_shixue_duration(lv) / 1000;
                const bonus = query_xd_shixue_bonus(lv);
                return `消耗你的生命，在${duration}秒内提升攻击速度、命中、攻击力${bonus}%，每次攻击反噬自身1%当前气血`;
            },
        },
        dao: {
            name: "血海魔刀",
            distime: 20000,
            enable_skill: "blade",
            mp: 20,
            release_time: 4000,
            query_mp: function (me: CHARACTER, lv: number): number {
                return query_xd_xuehai_mp(lv);
            },
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const count = query_xd_xuehai_count(lv);

                me.send_room(
                    "<hio>$N眼中血光暴射，狂啸一声，手中$W化作漫天血影，向$n铺天盖地倾泻而去！</hio>",
                    target,
                );

                let totalDamage = 0;
                for (let i = 0; i < count; i++) {
                    const sh = me.do_attack({
                        target: target,
                        gj: me.gj,
                        mz: me.mz,
                        attack_before: i > 0 ? "<hiw>紧跟着</hiw>" : undefined,
                    });
                    totalDamage += sh;
                }

                if (totalDamage > 0) {
                    const actualHeal = me.add_hp(totalDamage);
                    if (actualHeal > 0) {
                        me.send_room(
                            "<hio>$N刀锋饮血，$n伤口处血雾如泉喷涌，血气顺着$W刀锋灌入$N体内，整个人看起来精神了许多。</hio>",
                            target,
                        );
                    }
                }

                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const count = query_xd_xuehai_count(lv);
                return `对敌人瞬间劈出${count}刀，攻击结束后吸收你造成的总伤害恢复你的气血`;
            },
        },
    };
}


// ============================================================
// 血刀 — 公共计算函数（use 与 query_desc 共用，保证一致）
// ============================================================

/** 血刀被动：每降低1%气血增加的伤害% */
function query_xd_blood_per(lv: number): number {
    return Math.floor(lv / 1000) + 1;
}

/** 嗜血：持续时间（毫秒） */
function query_xd_shixue_duration(lv: number): number {
    return (5 + Math.floor(lv / 100)) * 1000;
}

/** 嗜血：三维加成百分比 */
function query_xd_shixue_bonus(lv: number): number {
    return 30 + Math.floor(lv / 100);
}

/** 嗜血：内力消耗 */
function query_xd_shixue_mp(lv: number): number {
    return 20 + lv;
}

/** 血海魔刀：攻击次数 */
function query_xd_xuehai_count(lv: number): number {
    return 5 + Math.floor(lv / 1000);
}

/** 血海魔刀：内力消耗 */
function query_xd_xuehai_mp(lv: number): number {
    return 20 + lv;
}
