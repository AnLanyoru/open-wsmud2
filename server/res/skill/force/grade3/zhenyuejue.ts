import {SKILL} from "../../../../core/skill/skill.js";
import type { PropMap } from "../../../../types/props.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "镇岳诀";
    id = "zhenyuejue";
    grade = 3;
    force_rad = 0.77;
    desc = "衡山派的内功心法。";
    can_enables = ["force"];
    learn_condition = {
        skill: {
            force: 400
        }
    };
    slots = [
        {
            prop: "limit_mp",
            value: (lv: number, grade: number) => grade === 3 ? 60 * lv : 120 * lv,
            query_needs: function (grade: number) {
                return [{
                    path: "book/wudao",
                    count: grade === 3 ? 6 : 10
                }, {
                    path: "book/bc#zhenyuejue",
                    count: 25
                }];
            },
            format: (val: number) => {
                return "内力上限：+" + val;
            }
        },
        {
            prop: "zyj_bl",
            value: (lv: number) => Math.floor(lv / 6),
            format: (val: number) => {
                return "镇岳额外增加" + val + "臂力";
            }
        },
        {
            prop: "zyj_cd",
            value: (lv: number) => 25,
            format: (val: number) => {
                return "镇岳诀冷却时间减少" + val + "%";
            }
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                fy: 10 + Math.floor(lv * 1.3),
                max_hp: 50 + lv * 10,
                fy_per: 3 + Math.floor(lv / 300),
                limit_mp: lv * 103,
                desc: "唯一：将你内力的77%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        zhenyue:
            {
                name: "镇岳",
                distime: 60000,
                enable_skill: "force",
                mp: 20,
                release_time: 500,
                use_type: 2,
                distime_per_key: "zyj_cd",
                use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                    const baseStr = Math.floor(lv / 3);
                    const extraStr = me.query_prop("zyj_bl");
                    const par: PropMap = {
                        str: baseStr + extraStr,
                    };
                    let time = 20000 + lv * 10;
                    if (time > 60000) time = 60000;
                    me.send_room("<hiy>$N沉声低喝，双掌下按，一股沉雄浑厚的真气自足底涌起，如岳峙渊渟，巍然不可撼动！</hiy>\n");
                    me.add_status({
                        id: "force",
                        name: "镇岳",
                        desc: "提高你的臂力",
                        prop: par,
                        duration: time,
                        finish_msg: "$N周身那股沉雄真气缓缓散去。",
                    });
                },
                query_desc: function (me: CHARACTER, lv: number) {
                    const str = Math.floor(lv / 3);
                    let time = 20000 + lv * 10;
                    if (time > 60000) time = 60000;
                    return "使用镇岳诀增加你" + str + "的臂力，持续" + (time / 1000) + "秒";
                }
            }
    };
}
