import {SKILL} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER } from "../../../../core/char/character.js";

// ============================================================
// 踏歌行 — 青城派高级轻功
// ============================================================

export default class extends SKILL {
    name = "踏歌行";
    id = "tagexing";
    grade = 2;

    desc = "青城派的轻功身法，步法潇洒飘逸，如诗人踏歌而行，于吟咏之间倏忽来去。";
    can_enables = ["dodge"];
    dodge_actions = [
        "$n朗声一笑，足下轻点，身形如踏歌般飘然后退，姿态潇洒之极。",
        "只见$n口中吟道「朝辞白帝彩云间」，身形已如诗句般飘忽不定，$N一击落空。",
        "$n步履轻快，仿若踏着节拍而行，整个人如行云流水般从$N的攻势中穿了过去。",
        "$n不待$N招式使尽，早已一曲踏歌，身形倏忽间已在数尺之外。",
        "但见$n袍袖翻飞，足下踏出青城绝学「踏歌行」，身形飘逸如仙，$N的攻势尽数落空。",
        "$n身形一转，衣袂飘飘，伴着若有若无的歌声，已然避开了$N这一招。",
    ];

    slots = [
        {
            prop: 'tgx_gj',
            name: "踏歌·击",
            value: (_lv: number) => 1000,
            format: (_val: number) => '踏歌行额外提升自身攻击1000点',
        },
        {
            prop: 'tgx_ds',
            name: "踏歌·闪",
            value: (_lv: number) => 1000,
            format: (_val: number) => '踏歌行额外提升自身躲闪1000点',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: 40 + Math.floor(lv * 13 / 10),
                dex: Math.floor(lv / 8) + 1,
            },
        };
    }

    pfm_set: PerformData = {
        tage: {
            name: "踏歌行",
            distime: 30000,
            enable_skill: "dodge",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = query_tgx_buff_duration(lv);
                const gjBonus = query_tgx_gj_bonus(lv) + me.query_prop("tgx_gj");
                const dsBonus = query_tgx_ds_bonus(lv) + me.query_prop("tgx_ds");

                me.send_room(
                    "<hiy>$N纵声长歌，足踏青城绝学「踏歌行」，身形随风而起，飘然若仙，气势陡然暴涨！</hiy>",
                    target,
                );

                me.add_status({
                    id: "dodge",
                    name: "踏歌",
                    desc: "踏歌而行，人在歌中，歌在人中，攻击与躲闪大幅提升。",
                    duration: duration,
                    prop: {
                        gj: gjBonus,
                        ds: dsBonus,
                    },
                    finish_msg: "$N一曲踏歌终了，身形缓缓落下，气势渐归平常。",
                });
            },
            query_desc: function(_me: CHARACTER, lv: number): string {
                const duration = query_tgx_buff_duration(lv);
                const gjBonus = query_tgx_gj_bonus(lv);
                const dsBonus = query_tgx_ds_bonus(lv);
                return `${toSec(duration)}内，提升自身攻击力${gjBonus}点，躲闪${dsBonus}点。`;
            },
        },
    };
}


// ============================================================
// 踏歌行 — 公共计算函数（use 与 query_desc 共用，保证一致）
// ============================================================

/** 踏歌行：持续时间（毫秒） */
function query_tgx_buff_duration(lv: number): number {
    return 10000 + lv * 10;
}

/** 踏歌行：攻击力加成（固定值） */
function query_tgx_gj_bonus(lv: number): number {
    return lv * 2;
}

/** 踏歌行：躲闪加成（固定值） */
function query_tgx_ds_bonus(lv: number): number {
    return 500 + lv * 2;
}
