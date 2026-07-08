import {SKILL} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap} from "../../../../core/skill/skill.js";
import type {LearnCondition} from "../../../../types/events.js";
import type {CHARACTER} from "../../../../core/char/character.js";

// ============================================================
// 笔翰如流 — 公共稀有轻功（梅庄）
// ============================================================

export default class extends SKILL {
    name = "笔翰如流";
    id = "bihanruliu";
    grade = 3;

    desc = "梅庄三庄主秃笔翁所创轻功，将书法笔势融入步法，灵动飘逸如笔墨流淌";
    can_enables = ["dodge"];

    dodge_actions = [
        "$n身随笔走，一招「横撇竖捺」，步法如行书写意，$N的招式堪堪落空。\n",
        "$n足下一点，身形如狂草般奔放不羁，倏忽间已在数尺之外。\n",
        "只见$n步法如篆书圆转，身形浑圆弧转间已将$N的攻击化为无形。\n",
        "$n以笔势入步，一招「悬针垂露」，身形如隶书波磔般舒展，轻轻避过一击。\n",
        "$n笔走龙蛇，步法如飞白流转，$N只见残影重重，不知$n真身何在。\n",
        "$n宛若握笔临帖，一招一式中规中矩却不失灵韵，$N的攻势被尽数化解。\n",
    ];

    learn_condition: LearnCondition = {
        dex1: 25,
    };

    slots = [
        {
            prop: "bhrl_gjsd",
            value: (_lv: number) => 500,
            format: (val: number) => "行云流水额外减少攻击间隔" + toSec(val) + "秒",
        },
        {
            prop: "bhrl_ds",
            value: (_lv: number) => 3000,
            format: (val: number) => "行云流水额外增加" + val + "躲闪",
        },
    ];

    pfm_set: PerformData = {
        xingyun: {
            name: "行云流水",
            distime: 35000,
            enable_skill: "dodge",
            mp: 25,
            release_time: 500,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = query_bhrl_duration(lv);
                const dsBonus = query_bhrl_ds_bonus(lv) + me.query_prop("bhrl_ds");
                const gjsdReduce = 1000 + me.query_prop("bhrl_gjsd");

                me.send_room(
                    "<HIC>$N笔走龙蛇，步法如行云流水般挥洒自如，身形飘逸若书法大家临帖挥毫！</HIC>",
                    target,
                );

                me.add_status({
                    id: "dodge",
                    name: "行云流水",
                    duration: duration,
                    prop: {
                        ds: dsBonus,
                        gjsd: gjsdReduce,
                    },
                    finish_msg: "$N行云流水之势渐收，步法恢复如常。",
                });

                me.reauto_attack();
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const duration = query_bhrl_duration(lv);
                const dsBonus = query_bhrl_ds_bonus(lv);
                return (
                    toSec(duration) + "秒" +
                    "内你的攻击间隔减少1秒，增加" +
                    dsBonus +
                    "躲闪。"
                );
            },
        },
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: Math.floor(lv * 1.2) + 135,
                mz: Math.floor(lv * 1.2) + 30,
                con: Math.floor(lv / 12) + 2,
            },
        };
    }
}

// ============================================================
// 笔翰如流 — 公共计算函数（use 与 query_desc 共用，保证一致）
// ============================================================

/** 行云流水：持续时间（毫秒） */
function query_bhrl_duration(lv: number): number {
    return (10 + Math.floor(lv / 1000)) * 1000;
}

/** 行云流水：躲闪加成 */
function query_bhrl_ds_bonus(lv: number): number {
    return 1000 + lv * 2;
}
