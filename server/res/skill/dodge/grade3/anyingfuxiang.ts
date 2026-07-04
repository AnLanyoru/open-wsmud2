import {SKILL} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap} from "../../../../core/skill/skill.js";
import type {CHARACTER} from "../../../../core/char/character.js";

// ============================================================
// 暗影浮香 — 公共稀有轻功（桃花岛）
// ============================================================

export default class extends SKILL {
    name = "暗影浮香";
    id = "anyingfuxiang";
    grade = 3;

    desc = "桃花岛的轻功身法";
    can_enables = ["dodge"];

    dodge_actions = [
        "$n身形一矮，如暗影般贴着地面掠出数尺，$N的攻势尽数落空。",
        "$n步法飘忽，身形倏地化作一缕幽香散开，$N只觉眼前一花已失$n踪影。",
        "只见$n足尖轻点，身如魅影般向后飘退，$N一招落空。",
        "$n身子如飞花般轻轻一转，带起一缕若有若无的幽香，避开了$N的攻击。",
        "$n不闪不避，身形却如暗影般忽地消散，$N的招式透影而过。",
        "$n一式「浮香暗度」，身法飘逸若仙，$N连$n衣角都未沾到。",
    ];

    slots = [
        {
            prop: "ayfx_mz",
            value: (lv: number) => 5 + int(lv / 200),
            format: (val: number) => "暗影附加的命中增加" + val + "%",
        },
    ];

    pfm_set: PerformData = {
        ying: {
            name: "暗影",
            distime: 32000,
            enable_skill: "dodge",
            mp: 20,
            release_time: 500,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = query_ayfx_duration(lv);
                const mzPer = query_ayfx_mz_per(lv) + me.query_prop("ayfx_mz");

                me.send_room(
                    "<HIM>$N身形如暗影般倏然消散，只余一缕幽香飘荡空中，令人难以捉摸……</HIM>",
                    target,
                );

                me.add_status({
                    id: "dodge",
                    name: "暗影",
                    duration: duration,
                    prop: {
                        mz_per: mzPer,
                    },
                    finish_msg: "$N的身影从暗影中重新凝聚，幽香渐散。",
                });

                me.reauto_attack();
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const duration = query_ayfx_duration(lv);
                const mzPer = query_ayfx_mz_per(lv);
                return toSec(duration) + "内增加你" + mzPer + "%命中";
            },
        },
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: lv * 2 + 100,
                mz: Math.floor(lv * 1.5) + 100,
            },
        };
    }
}

// ============================================================
// 暗影浮香 — 公共计算函数（use 与 query_desc 共用，保证一致）
// ============================================================

/** 暗影：持续时间（毫秒） */
function query_ayfx_duration(lv: number): number {
    return 8000 + lv * 2;
}

/** 暗影：命中百分比加成 */
function query_ayfx_mz_per(lv: number): number {
    return 20 + Math.floor(lv / 200);
}
