import {SKILL} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "阴阳九转";
    id = "yinyangjiuzhuan";
    grade = 6;
    force_rad = 1.25;

    desc = "阴阳相生，九转归一";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        const hpPer = 5 + Math.floor(lv / 100);
        const pct = 5 + Math.floor(lv / 200);
        return {
            force: {
                hp_per: hpPer,
                add_sh_per: pct,
                diff_fy_per: pct,
                diff_sh_per: pct,
                limit_mp: lv * 950,
                desc: "唯一：将你内力的125%转化为气血",
            },
        };
    }

    /**
     * 九烛——受击时反震伤害（仅九烛形态下生效）
     */
    on_damage(me: CHARACTER, sh: number, from?: CHARACTER): number {
        if (sh > 0 && from && from.hp > 0) {
            const jiuzhu = me.query_temp("yyjz_jz", 0);
            if (jiuzhu) {
                const lv = me.query_skill("yinyangjiuzhuan", 0);
                const recoil = jiuzhu_recoil(me, lv);
                if (recoil > 0) {
                    me.send_combat(
                        "<hio>$N体内阴阳二气受击而激，九烛之力反震而出！</hio>\n",
                        from,
                    );
                    from.damage3(recoil, me);
                    me.end_attack(from);
                }
            }
        }
        return sh;
    }

    pfm_set: PerformData = {
        zhuanyang: {
            name: "转阴阳",
            distime: 30000,
            enable_skill: "force",
            mp: 120,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                // 切换阴阳形态：如果当前是九烛则切九幽，否则切九烛
                const isJiuzhu = me.query_temp("yyjz_jz", 0);
                const duration = zhuanyang_duration(lv);

                if (isJiuzhu) {
                    // 切换到九幽（攻击形态）
                    me.remove_temp("yyjz_jz");
                    const gjPer = jiuyou_gj_per(lv);
                    const speedPer = jiuyou_speed_per(lv);

                    me.send_room("<hio>$N逆转阴阳，幽煞翻涌，九幽之力加身，杀意弥天！</hio>\n", target);

                    me.add_status({
                        id: "force",
                        name: "转阴阳·九幽",
                        duration: duration,
                        override: 2,
                        prop: {
                            gj_per: gjPer,
                            diff_fy_per: gjPer,
                            gjsd_per: -speedPer,
                        },
                        on_attach: (p: CHARACTER) => p.set_temp("yyjz_jy", 1, duration),
                        on_expire: (p: CHARACTER) => p.remove_temp("yyjz_jy"),
                        finish_msg: "<hio>$N周身九幽之气如潮退去，复转如常。</hio>",
                    });
                } else {
                    // 切换到九烛（防御形态）
                    me.remove_temp("yyjz_jy");
                    const hpPer = jiuzhu_hp_per(lv);

                    me.send_room("<hio>$N掌阴阳之枢，九烛之力流转周身，固若金汤！</hio>\n", target);

                    me.add_status({
                        id: "force",
                        name: "转阴阳·九烛",
                        duration: duration,
                        override: 2,
                        prop: {
                            hp_per: hpPer,
                            diff_sh_per: hpPer,
                        },
                        on_attach: (p: CHARACTER) => p.set_temp("yyjz_jz", 1, duration),
                        on_expire: (p: CHARACTER) => p.remove_temp("yyjz_jz"),
                        finish_msg: "<hio>$N周身九烛之光渐黯。</hio>",
                    });
                }

                me.reauto_attack();
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                const hpPer = jiuzhu_hp_per(lv);
                const recoil = jiuzhu_recoil(me, lv);
                const gjPer = jiuyou_gj_per(lv);
                const speedPer = jiuyou_speed_per(lv);
                return "转换你的阴阳二气：\n九烛：增加你" + hpPer + "%的最大气血和伤害减免(被动)，命中后对敌人造成" + recoil + "点反震伤害。\n九幽：增加你" + gjPer + "%的攻击，" + gjPer + "%的无视防御，" + speedPer + "%的攻击速度";
            },
        },
        qiankun: {
            name: "定乾坤",
            distime: 60000,
            enable_skill: "force",
            mp: 2100,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const enemies = me.get_nearby_enemies();
                if (!enemies.length) {
                    me.send_room("<hio>$N双掌虚按，阴阳二气流转，但四周并无敌人可定。", target);
                    me.end_attack(target);
                    return;
                }

                const duration = dingqiankun_duration(lv);

                me.send_room("<hio>$N双掌虚按，阴阳二气化生乾坤，四周敌人体内真气为之一滞，动弹不得！</hio>\n", target);

                for (const enemy of enemies) {
                    enemy.add_status({
                        id: "faint",
                        name: "昏迷",
                        desc: "被阴阳九转定乾坤之力封印",
                        is_faint: true,
                        downside: true,
                        duration: duration,
                    }, me);
                }

                me.end_attack(target);
            },
            query_desc: function(_me: CHARACTER, lv: number): string {
                const duration = dingqiankun_duration(lv);
                return "压制附近敌人，" + toSec(duration) + "秒内封印敌方技能";
            },
        },
        zhentd: {
            name: "镇天地",
            distime: 60000,
            enable_skill: "force",
            mp: 1650,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                if (!target || target.hp <= 0) {
                    me.notify_fail("没有目标！");
                    return;
                }

                // 如果已在镇守状态，取消
                if (me.query_temp("yyjz_zt", 0)) {
                    me.remove_temp("yyjz_zt");
                    me.send_room("<hio>$N收敛天地之力，退出镇守状态。</hio>", target);
                    me.end_attack(target);
                    return;
                }

                const totalDuration = zhentiandi_duration(lv);
                const dmgPct = zhentiandi_dmg_pct(lv);

                me.send_room("<hio>$N引动天地之力，周身土石飞旋，一股厚重无比的威压镇向$n！</hio>\n", target);

                // 施加镇守状态
                me.add_status({
                    id: "force",
                    name: "镇天地",
                    duration: totalDuration,
                    override: 2,
                    prop: {
                        diff_sh_per: 50,
                    },
                    on_attach: (p: CHARACTER) => p.set_temp("yyjz_zt", 1, totalDuration),
                    on_expire: (p: CHARACTER) => p.remove_temp("yyjz_zt"),
                    finish_msg: "<hio>$N周身天地之力散去，镇守状态结束。</hio>",
                });

                // 每秒对目标造成伤害
                target.add_status({
                    id: "yyjz_ztd",
                    name: "镇伤",
                    desc: "被天地之力镇压",
                    duration: 1000,
                    duration_count: Math.floor(totalDuration / 1000),
                    downside: true,
                    on_interval: function(t: CHARACTER, _over_count: number): void {
                        const dmg = me.gj + Math.floor(t.hp * dmgPct / 100);
                        t.damage3(dmg, me);
                        me.send_combat(
                            "<hio>天地之力镇压，" + t.name + "受到" + dmg + "点伤害。</hio>\n",
                            t,
                        );
                        me.end_attack(t);
                    },
                    start_msg: "<hio>$n被天地之力镇压，动弹不得！</hio>",
                    finish_msg: "<hio>$n终于挣脱了天地之力的镇压。</hio>",
                }, me);

                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                const duration = zhentiandi_duration(lv);
                const dmgPct = zhentiandi_dmg_pct(lv);
                return toSec(duration) + "秒内大幅增加减伤，引导天地之力攻击单个敌人，每秒造成自己攻击力附加敌方" + dmgPct + "%当前气血的伤害，1秒后再次使用可取消镇守状态";
            },
        },
    };
}


// ═══════════════════════════════════════════
// 阴阳九转 — 公共计算函数
// ═══════════════════════════════════════════

/** 转阴阳——持续时间（毫秒）：无固定持续，形态切换 */
function zhuanyang_duration(lv: number): number {
    return 30000 + lv * 10;
}

/** 九烛——气血/减伤加成%：50 + Math.floor(lv / 200)，封顶75 */
function jiuzhu_hp_per(lv: number): number {
    return Math.min(75, 50 + Math.floor(lv / 200));
}

/** 九烛——反震伤害 */
function jiuzhu_recoil(me: CHARACTER, lv: number): number {
    return Math.floor(me.gj * lv / 40);
}

/** 九幽——攻击/无视防御%：20 + Math.floor(lv / 50)，封顶80 */
function jiuyou_gj_per(lv: number): number {
    return Math.min(80, 20 + Math.floor(lv / 50));
}

/** 九幽——攻速%：10 + Math.floor(lv / 100)，封顶40 */
function jiuyou_speed_per(lv: number): number {
    return Math.min(40, 10 + Math.floor(lv / 100));
}

/** 定乾坤——封印持续时间（毫秒）：3000 + lv */
function dingqiankun_duration(lv: number): number {
    return 3000 + lv;
}

/** 镇天地——持续时间（毫秒）：min(15秒, lv * 3 + 1000) */
function zhentiandi_duration(lv: number): number {
    return Math.min(15000, Math.max(2000, lv * 3 + 1000));
}

/** 镇天地——敌方当前气血伤害% */
function zhentiandi_dmg_pct(_lv: number): number {
    return 1;
}
