import {SKILL} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER } from "../../../../core/char/character.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends SKILL {
    name = "玉女心经";
    id = "yunvxinjing";
    grade = 3;
    force_rad = 0.80;
    desc = "古墓派内功绝学，以轻灵见长";
    can_enables = ["force"];
    learn_condition = {
        max_mp: 50000,
        skill: {
            force: 300
        }
    };
    slots = [
        {
            prop: "limit_mp",
            value: (lv: number, grade: number) => grade === 3 ? 60 * lv : 125 * lv,
            query_needs: function (grade: number) {
                return [{
                    path: "book/wudao",
                    count: grade === 3 ? 6 : 10
                }, {
                    path: "book/bc#yunvxinjing",
                    count: 25
                }];
            },
            format: (val: number) => {
                return "内力上限：+" + val;
            }
        },
        {
            prop: "per",
            value: (lv: number) => 1 + Math.floor(lv/1000),
            format: (val: number) => "容貌：+" + val,
        },
        {
            prop: "ynxj_qw_bj",
            value: (lv: number) => 3 + Math.floor(lv/500),
            format: (val: number) => "容貌超过20后额外增加轻舞" + val + "%暴击",
        },
        {
            prop: "ynxj_qw_hf",
            value: (lv: number) => 1 + Math.floor(lv/250),
            format: (val: number) => "容貌超过20后额外增加轻舞" + val + "%忽视防御",
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: 4 + Math.floor(lv * 1.4),
                ds: 4 + Math.floor(lv * 1.4),
                per: 1 + Math.floor(lv / 500),
                limit_mp: lv * 100,
                desc: "唯一：将你内力的80%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        qingwu:
            {
                name: "轻舞",
                distime: 28000,
                enable_skill: "force",
                mp: 20,
                release_time: 4000,
                use_type: 2,
                use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                    const per = 10 + Math.floor(lv / 300);
                    let time = 10000 + lv * 5;
                    if (time > 20000) time = 20000;
                    const prop: PropMap = {
                        gj_per: per,
                        ds_per: per,
                        per: 1 + Math.floor(lv / 500),
                    };
                    // 容貌超过20后额外暴击与忽视防御
                    if (me.query_prop("per") > 20) {
                        const bj = me.query_prop("ynxj_qw_bj");
                        const hf = me.query_prop("ynxj_qw_hf");
                        if (bj > 0) prop.bj_per = bj;
                        if (hf > 0) prop.diff_fy_per = hf;
                    }
                    me.send_room("<him>$N素袂轻扬，足尖微点，刹那间身形飘忽如冷月凌波，步步生莲，教人目眩神迷！</him>\n", target);
                    me.add_status({
                        id: "force",
                        name: "轻舞",
                        desc: "提升你的攻击、躲闪与容貌",
                        duration: time,
                        prop,
                        finish_msg: "$N的轻舞之姿渐渐停歇，真气回拢丹田。",
                    });
                },
                query_desc: function (me: CHARACTER, lv: number) {
                    const per = 10 + Math.floor(lv / 300);
                    let time = 10000 + lv * 5;
                    if (time > 20000) time = 20000;
                    return (time / 1000) + "秒内提高你" + per + "%的攻击、躲闪，增加容貌。";
                }
            }
    };
}
