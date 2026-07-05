import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap} from "../../../core/skill/skill.js";
import type {CHARACTER} from "../../../core/char/character.js";

/**
 * 千里追风 — 六扇门轻功绝技（高级技能）
 * 千里追捕，无往不胜
 * 完善度：50%
 */
export default class extends SKILL {
    name = "千里追风";
    id = "qianlizhuifeng";
    grade = 2;
    family = FAMILIES.LIUSHAN;
    desc = "六扇门轻功绝技，千里追捕，无往不胜";
    can_enables = ["dodge"];

    dodge_actions = [
        "$n足尖轻点，身形如追风逐电般掠出数丈，$N的攻势尽数落空。",
        "$n施展「千里追风」身法，一道残影闪过，$N只觉眼前一花，已然失了目标。",
        "却见$n步若流星，身形疾掠，正是六扇门千里追风之术，倏忽间已在数尺之外。",
        "$n身形一纵，如鹰隼破空，刹那间飘开数丈，$N的招式堪堪击在空处。",
    ];

    slots = [
        {
            prop: "qlzf_gjsd",
            value: (_lv: number) => 200,
            format: (val: number) => "追风额外减少攻击间隔" + toSec(val) + "秒",
        },
        {
            prop: "qlzf_duration",
            value: (_lv: number) => 2000,
            format: (val: number) => "追风的持续时间额外增加" + toSec(val) + "秒",
        },
        {
            prop: "qlzf_release",
            value: (_lv: number) => 500,
            format: (val: number) => "追风额外减少释放间隔" + toSec(val) + "秒",
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: 200 + Math.floor(lv * 1.5),
                gjsd: 200,
            },
        };
    }

    pfm_set: PerformData = {
        zhui: {
            name: "追风",
            distime: 45000,
            enable_skill: "dodge",
            mp: 30,
            release_time: 500,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = query_zhui_duration(lv) + me.query_prop("qlzf_duration");
                const gjsdReduce = query_zhui_speed(lv) + me.query_prop("qlzf_gjsd");

                me.send_room(
                    "<HIC>$N深吸一口气，足下生风，身形陡然加快，正是六扇门轻功绝技——「追风」！</HIC>",
                    target,
                );

                me.add_status({
                    id: "dodge",
                    name: "追风",
                    duration: duration,
                    prop: {
                        gjsd: -gjsdReduce,
                    },
                    finish_msg: "$N足下劲风渐息，身形恢复如常。",
                });

                me.reauto_attack();
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const duration = query_zhui_duration(lv);
                const speedSec = toSec(query_zhui_speed(lv));
                return (
                    toSec(duration) +
                    "秒内增加你" +
                    speedSec +
                    "秒的攻击速度和释放速度"
                );
            },
        },
    };
}

// ============================================================
// 千里追风 — 公共计算函数
// ============================================================

/** 追风：持续时间（毫秒） */
function query_zhui_duration(lv: number): number {
    return Math.min(3000 + Math.floor((lv - 100) / 200) * 1000, 10000);
}

/** 追风：攻速/释放速度加成（毫秒） */
function query_zhui_speed(lv: number): number {
    return 1000 + Math.floor((lv - 100) / 400) * 50;
}
