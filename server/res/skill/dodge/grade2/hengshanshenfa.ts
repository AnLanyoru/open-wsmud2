import {SKILL} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER } from "../../../../core/char/character.js";

// ============================================================
// 恒山身法 — 恒山派高级轻功
// ============================================================

export default class extends SKILL {
    name = "恒山身法";
    id = "hengshanshenfa";
    grade = 2;

    desc = "恒山派的轻功身法，步法轻灵稳健，如行云流水，颇具佛门清静之意。";
    can_enables = ["dodge"];
    dodge_actions = [
        "$n双掌合十，身形一矮，足下踏出恒山身法，飘然向后退开丈余。",
        "却见$n神色淡然，脚下步履从容，身形微侧间已闪过了$N的凌厉一击。",
        "$n足尖轻点，整个人如白云出岫般飘然而起，$N的攻势尽数落空。",
        "$n不慌不忙，袍袖轻拂，一式「清风徐来」配合恒山身法，轻轻巧巧地避了开去。",
        "只见$n身形一转，脚下如踏莲花，姿态优雅地让过了$N这一招。",
        "$n步履轻盈，仿若足不沾尘，恒山派轻功身法果然名不虚传。",
    ];

    slots = [
        {
            prop: 'hssf_ds',
            name: "灵虚·闪",
            value: (_lv: number) => 5,
            format: (_val: number) => '灵虚额外增加5%躲闪',
        },
        {
            prop: 'hssf_fy',
            name: "灵虚·御",
            value: (_lv: number) => 5,
            format: (_val: number) => '灵虚额外增加5%防御',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: lv + 100,
                fy: lv + 200,
            },
        };
    }

    pfm_set: PerformData = {
        ling: {
            name: "灵虚",
            distime: 30000,
            enable_skill: "dodge",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = query_hssf_lingxu_duration(lv);
                const bonus = query_hssf_lingxu_bonus(lv);
                const dsBonus = bonus + me.query_prop("hssf_ds");
                const fyBonus = bonus + me.query_prop("hssf_fy");

                me.send_room(
                    "<hic>$N闭目凝神，双掌合十，足下踏出恒山身法之「灵虚」，身形顿时变得飘忽不定，如镜花水月般难以捉摸。</hic>",
                    target,
                );

                me.add_status({
                    id: "dodge",
                    name: "灵虚",
                    desc: "恒山身法之灵虚，心如止水，身若浮云，躲闪与防御大幅提升。",
                    duration: duration,
                    prop: {
                        ds_per: dsBonus,
                        fy_per: fyBonus,
                    },
                    finish_msg: "$N的灵虚身法运功完毕，身形重归平常。",
                });
            },
            query_desc: function(_me: CHARACTER, lv: number): string {
                const duration = query_hssf_lingxu_duration(lv);
                const bonus = query_hssf_lingxu_bonus(lv);
                return `${toSec(duration)}内增加你${bonus}%躲闪，防御提高${bonus}%`;
            },
        },
    };
}


// ============================================================
// 恒山身法 — 公共计算函数（use 与 query_desc 共用，保证一致）
// ============================================================

/** 灵虚：持续时间（毫秒） */
function query_hssf_lingxu_duration(lv: number): number {
    return 6000 + lv * 5;
}

/** 灵虚：躲闪与防御加成百分比 */
function query_hssf_lingxu_bonus(lv: number): number {
    return 10 + Math.floor(lv / 100);
}
