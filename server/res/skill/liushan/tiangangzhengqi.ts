import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap} from "../../../core/skill/skill.js";
import type {CHARACTER} from "../../../core/char/character.js";
import type {PropMap} from "../../../types/props.js";

/**
 * 天罡正气 — 六扇门镇派内功（绝世武功）
 * 凝聚天地正气，可震慑邪祟，爆发时刚猛无俦
 * 完善度：50%
 */
export default class extends SKILL {
    name = "天罡正气";
    id = "tiangangzhengqi";
    grade = 4;
    force_rad = 0.9;
    family = FAMILIES.LIUSHAN;
    desc = "六扇门镇派内功，凝聚天地正气，可震慑邪祟，爆发时刚猛无俦。";
    can_enables = ["force"];

    slots = [
        {
            prop: "tgzq_mz",
            value: (_lv: number) => 40,
            format: (val: number) => "正气诀额外增加" + val + "%命中",
        },
        {
            prop: "tgzq_heal",
            value: (_lv: number) => 5,
            format: (val: number) => "正气诀降低对方疗伤效果增加" + val + "%",
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: 800 + lv * 15,
                fy: 150 + lv * 2,
                limit_mp: lv * 160,
                desc: "唯一：将你内力的90%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        zheng: {
            name: "正气诀",
            distime: 45000,
            enable_skill: "force",
            mp: 50,
            release_time: 500,
            use_type: 2,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = query_zhengqi_duration(lv);
                const gjPer = query_zhengqi_gj_per(lv);
                const mzPer = query_zhengqi_gj_per(lv) + me.query_prop("tgzq_mz");
                const healReduce = 50 + me.query_prop("tgzq_heal");

                me.send_room(
                    "<HIY>$N凝神聚气，周身天罡正气勃然而发，一股浩然之气如山岳般压向四方！</HIY>",
                    target,
                );

                // 对自己施加增益
                const prop: PropMap = {
                    gj_per: gjPer,
                };
                if (mzPer > 0) {
                    prop.mz_per = mzPer;
                }

                me.add_status({
                    id: "force",
                    name: "正气诀",
                    duration: duration,
                    prop: prop,
                    finish_msg: "$N周身正气渐收，回归丹田。",
                });

                me.reauto_attack();

                // 对附近敌人施加压制：降低疗伤效果
                const nearby = me.get_nearby_enemies();
                for (let i = 0; i < nearby.length; i++) {
                    const enemy = nearby[i];
                    if (enemy && enemy !== target) {
                        enemy.add_status({
                            id: "tgzq_yz",
                            name: "正气压制",
                            duration: duration,
                            downside: true,
                            prop: {
                                recover_per: -healReduce,
                            },
                            desc: "被天罡正气压制，疗伤效果降低" + healReduce + "%",
                        }, me);
                    }
                }

                // 对当前目标也施加压制
                if (target) {
                    target.add_status({
                        id: "tgzq_yz",
                        name: "正气压制",
                        duration: duration,
                        downside: true,
                        prop: {
                            recover_per: -healReduce,
                        },
                        desc: "被天罡正气压制，疗伤效果降低" + healReduce + "%",
                    }, me);
                }
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const duration = query_zhengqi_duration(lv);
                const gjPer = query_zhengqi_gj_per(lv);
                return (
                    "爆发全身天罡正气在" +
                    toSec(duration) +
                    "秒内提升" +
                    gjPer +
                    "%攻击，对附近敌人造成压制降低50%疗伤效果。"
                );
            },
        },
    };
}

// ============================================================
// 天罡正气 — 公共计算函数
// ============================================================

/** 正气诀：持续时间（毫秒） */
function query_zhengqi_duration(lv: number): number {
    return (6 + Math.floor(lv / 500)) * 1000;
}

/** 正气诀：攻击提升百分比 */
function query_zhengqi_gj_per(lv: number): number {
    return 30 + Math.floor(lv / 100);
}
