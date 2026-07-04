import {SKILL} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap} from "../../../../core/skill/skill.js";
import type {CHARACTER} from "../../../../core/char/character.js";

// ============================================================
// 明玉功 — 公共绝世武功（移花宫，内功+轻功双位置）
// ============================================================

export default class extends SKILL {
    name = "明玉功";
    id = "mingyugong";
    grade = 4;
    force_rad = 0.7;

    desc = "移花宫的绝世武学，移花宫历代宫主修炼的最高内家正宗绝顶心法";
    can_enables = ["dodge", "force"];

    dodge_actions = [
        "$n面如寒玉，足下无声，一式「冰心玉步」悄然滑开，$N的招式堪堪落空。",
        "$n身形如琉璃映月般澄澈通透，$N只觉眼前一花，$n已移至数尺之外。",
        "只见$n袍袖轻拂，宛若玉璧无瑕，步法圆转如意间已将$N的攻势化于无形。",
        "$n双眸微阖，周身散发出冷玉般的清辉，$N的攻击竟如击入虚空，全无着落。",
        "$n一袭白影如玉石凝光，步法翩若惊鸿，$N只见残影幢幢，不知$n真身所在。",
        "$n唇角微扬，神情淡然如无波古井，身形却已如明玉映雪般不着痕迹地避开一击。",
    ];

    learn_condition = {
        dex1: 30,
        int1: 30,
    };

    slots = [
        {
            prop: "myg_per",
            value: (lv: number) =>  2 + int(lv/1000),
            format: (val: number) => "容貌：+" + val,
        },
        {
            prop: "myg_count",
            value: (lv: number) => 2 + int(lv/1000),
            format: (val: number) => "太上忘情最大持续次数增加" + val,
        },
        {
            prop: "myg_noclear",
            value: (_lv: number) => 1,
            format: (_val: number) => "太上忘情启动后无法被清除",
        },
    ];

    pfm_set: PerformData = {
        mingyu: {
            name: "明玉",
            distime: 60000,
            enable_skill: "dodge",
            mp: 20,
            release_time: 500,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const buffPct = query_myg_mingyu_pct(lv);
                const duration = query_myg_mingyu_duration(lv);

                me.send_room(
                    "<HIM>$N默运明玉功，肌肤若冰雪，绰约若处子，周身清辉流转，凛然不可逼视！</HIM>",
                    target,
                );

                me.add_status({
                    id: "dodge",
                    name: "明玉",
                    duration: duration,
                    prop: {
                        gj_per: buffPct,
                        fy_per: buffPct,
                        mz_per: buffPct,
                        ds_per: buffPct,
                        zj_per: buffPct,
                    },
                    finish_msg: "$N周身冰雪清辉渐敛，真炁归元，复还本真。",
                });

                me.reauto_attack();
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const buffPct = query_myg_mingyu_pct(lv);
                const duration = query_myg_mingyu_duration(lv);
                return (
                    "使用明玉功提升战力，增加你" +
                    buffPct +
                    "%的攻击，防御，命中，躲闪，招架，持续" +
                    toSec(duration)
                );
            },
        },
        tai: {
            name: "太上忘情",
            distime: 30000,
            enable_skill: "dodge",
            mp: 30,
            release_time: 500,
            check: function (_me: CHARACTER, lv: number): boolean {
                return lv >= 900;
            },
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const damage = query_myg_tai_damage(lv);
                const baseCount = query_myg_tai_count(lv);
                const extraCount = me.query_prop("myg_count");
                const totalCount = baseCount + extraCount;
                const noclear = me.query_prop("myg_noclear") > 0;

                me.send_room(
                    "<HIM>$N双目微阖，面如寒玉，心神已入太上忘情之境，万物不萦于怀，唯余一片冰心！</HIM>",
                    target,
                );

                me.add_status({
                    id: "force",
                    name: "太上忘情",
                    duration: 2000,
                    duration_count: totalCount,
                    no_clear: noclear,
                    on_interval: function (caster: CHARACTER, _over_count: number): boolean | void {
                        const enemy = caster.query_enemy();
                        if (!enemy) return false;
                        caster.send_room(
                            "<HIM>$N心如止水，神游太上，$n陡觉一缕无形寒炁透体而至！</HIM>",
                            enemy,
                        );
                        enemy.from_attack(damage, 999999, "", "<hir>$n为真炁所侵，四肢百骸如堕冰渊，霎时间面如霜雪！</hir>");
                    },
                    finish_msg: "$N缓缓睁开双眼，从太上忘情之境中退了出来。",
                });
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const damage = query_myg_tai_damage(lv);
                const count = query_myg_tai_count(lv);
                return (
                    "明玉功之太上忘情，每2秒对敌人造成" +
                    damage +
                    "伤害，持续" +
                    count +
                    "次，无法躲闪。"
                );
            },
        },
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                dazuo_per: query_myg_dazuo_per(lv),
                expend_mp_per: 10,
                per: query_myg_per(lv),
                max_hp: lv * 10,
                limit_mp: lv * 150,
                desc: "唯一：将你内力的70%转化为气血",
            },
            dodge: {
                ds: Math.floor(lv * 1.4) + 100,
                dex: Math.floor(lv / 6) + 10,
            },
        };
    }
}

// ============================================================
// 明玉功 — 公共计算函数
// ============================================================

/** 打坐效率 */
function query_myg_dazuo_per(lv: number): number {
    return 10 + Math.floor(lv / 100);
}

/** 容貌加成 */
function query_myg_per(lv: number): number {
    return 1 + Math.floor(lv / 500);
}

/** 明玉：buff 百分比 */
function query_myg_mingyu_pct(lv: number): number {
    return 10 + Math.floor(lv / 100);
}

/** 明玉：持续时间（毫秒） */
function query_myg_mingyu_duration(lv: number): number {
    return 20000 + lv * 10;
}

/** 太上忘情：每次伤害值 */
function query_myg_tai_damage(lv: number): number {
    return Math.floor((lv * 17) / 1000);
}

/** 太上忘情：持续次数（上限 20） */
function query_myg_tai_count(lv: number): number {
    return Math.min(20, 3 + Math.floor(lv / 50));
}
