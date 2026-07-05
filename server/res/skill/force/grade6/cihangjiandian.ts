import {SKILL} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";
import { PropMap } from "../../../../types/props.js";

export default class extends SKILL {
    name = "慈航剑典";
    id = "cihangjiandian";
    grade = 6;
    force_rad = 1.2;

    desc = "慈航静斋的镇派宝典，以心剑合一为至高境界";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        const gjMz = Math.floor(lv * 3) + 100;
        const pct = 5 + Math.floor(lv / 200);
        const awePct = awe_pct(lv);
        return {
            force: {
                gj: gjMz,
                mz: gjMz,
                mz_per: pct,
                add_sh_per: pct,
                diff_fy_per: pct,
                limit_mp: lv * 900,
                desc: "震慑：使附近敌人躲闪和招架降低" + awePct + "%\n灵动：当你开始战斗的5秒内无法被控制\n唯一：将你内力的120%转化为气血",
            },
        };
    }

    /**
     * 灵动——战斗开始5秒内免疫控制
     * 震慑——使附近敌人躲闪和招架降低
     */
    on_beginfight(me: CHARACTER, _target: CHARACTER): void {
        // 灵动
        me.add_status({
            id: "cihang_lingdong",
            name: "灵动",
            desc: "慈航剑典护体，不受控制",
            duration: 5000,
            ig_control: true,
            finish_msg: "<hic>$N的灵动剑气收敛，恢复常态。</hic>",
        });

        // 震慑
        const lv = me.query_skill("cihangjiandian", 0);
        if (lv <= 0) return;
        const awePct = awe_pct(lv);
        const enemies = me.get_nearby_enemies();
        if (!enemies.length) return;
        me.send_room("<hio>$N慈航剑气凌然，一股无形的威压笼罩四野，周遭之敌无不心神震颤！</hio>");
        for (const enemy of enemies) {
            enemy.add_status({
                id: "cihang_zs",
                name: "震慑",
                desc: "被慈航剑典震慑，躲闪和招架降低",
                duration: 0,
                downside: true,
                no_diff: true,
                only_combat: true,
                prop: {
                    ds_per: -awePct,
                    zj_per: -awePct,
                },
            }, me);
        }
    }

    pfm_set: PerformData = {
        lingxi: {
            name: "心有灵犀",
            distime: 30000,
            enable_skill: "force",
            mp: 1150,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = lingxi_duration(lv);

                me.send_room("<hic>$N心神澄澈，剑意通明，进入「心有灵犀」之境，每招每式皆如天授！</hic>\n", target);

                me.add_status({
                    id: "force",
                    name: "心有灵犀",
                    duration: duration,
                    ig_control: true,
                    override: 2,
                    prop: {
                        gjsd_per: -30,
                    },
                    on_attach: (p: CHARACTER) => p.set_temp("cihang_lx", lingxi_extra_max(lv), duration),
                    on_expire: (p: CHARACTER) => p.remove_temp("cihang_lx"),
                    finish_msg: "<hic>$N从心有灵犀之境中退出。</hic>",
                });

                me.reauto_attack();
                me.end_attack(target);
            },
            query_desc: function(_me: CHARACTER, lv: number): string {
                const duration = lingxi_duration(lv);
                return toSec(duration) + "秒内你的攻击命中对方后将触发多次，并且不会被控制";
            },
        },
        jianxin: {
            name: "剑心通明",
            distime: 60000,
            enable_skill: "force",
            mp: 2600,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = jianxin_duration(lv);
                const swordPer = jianxin_sword_per(lv);

                me.send_room("<hio>$N双眸微阖，周身剑气冲霄，踏入「剑心通明」之境！万物破绽尽收眼底！</hio>\n", target);

                const prop: PropMap = {
                        distime_per: 100,
                        releasetime_per: 100,
                    };
                const weapon = me.query_weapon();
                if (weapon && weapon.weapon_type === "sword") {
                    prop.diff_fy_per = swordPer;
                }
                me.add_status({
                    id: "force",
                    name: "剑心",
                    duration: duration,
                    override: 2,
                    prop,
                    on_attach: (p: CHARACTER) => {
                        p.set_temp("cihang_jx", 1, duration);
                    },
                    on_expire: (p: CHARACTER) => p.remove_temp("cihang_jx"),
                    finish_msg: "<hio>$N剑心收敛，通明之境如潮退去。</hio>",
                });

                me.reauto_attack();
                me.end_attack(target);
            },
            query_desc: function(_me: CHARACTER, lv: number): string {
                const duration = jianxin_duration(lv);
                const swordPer = jianxin_sword_per(lv);
                return toSec(duration) + "秒内进入剑心通明状态，出招速度和冷却速度缩减到极限，洞悉对方弱点绝对命中招架，如果装备剑伤害增加" + swordPer + "%";
            },
        },
    };

    on_before_attack(me: CHARACTER, target: CHARACTER, par: DoAttackPar): void {
        if (me.query_temp("cihang_jx", 0)) {
            par.no_dodge = true;
            par.no_parry = true;
        }
    }
    /**
     * 心有灵犀——命中后触发多次攻击
     */
    on_force_over(me: CHARACTER, target: CHARACTER, _par: DoAttackPar, sh: number): void {
        if (sh <= 0) return;
        if (!target || target.hp <= 0) return;
        const extra_hit = me.query_temp("cihang_lx", 0)
        if (!extra_hit) return;
        const extraHits = 1 + Math.floor(Math.random() * extra_hit);
        for (let i = 0; i < extraHits; i++) {
            if (target.hp <= 0) break;
            me.do_attack({
                target,
                gj: me.gj,
                mz: me.mz,
                attack_msg: "<hic>$N剑随心动，灵犀剑气寻隙而入</hic>",
            });
        }
    }
}


// ═══════════════════════════════════════════
// 慈航剑典 — 公共计算函数
// ═══════════════════════════════════════════

/** 心有灵犀持续时间（毫秒）：固定10秒 */
function lingxi_duration(_lv: number): number {
    return 10000;
}

/** 剑心通明持续时间（毫秒）：min(10秒, 3 + lv/100 秒) */
function jianxin_duration(lv: number): number {
    return Math.min(10000, 3000 + lv * 10);
}

/** 剑心通明剑伤害加成%：30 + Math.floor(lv / 100) */
function jianxin_sword_per(lv: number): number {
    return 30 + Math.floor(lv / 100);
}

/** 心有灵犀额外攻击次数上限：1 + lv / 1000 */
function lingxi_extra_max(lv: number): number {
    return 1 + int(lv / 1000);
}

/** 震慑——降低躲闪/招架%：10 + Math.floor(lv / 200) */
function awe_pct(lv: number): number {
    return 10 + Math.floor(lv / 200);
}
