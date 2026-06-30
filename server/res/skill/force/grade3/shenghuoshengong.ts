import {SKILL} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "圣火神功";
    id = "shenghuoshengong";
    grade = 3;
    force_rad = 0.70;
    desc = "明教的内功心法";
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
            value: (lv: number, grade: number) => grade === 3 ? 60 * lv : 122 * lv,
            query_needs: function (grade: number) {
                return [{
                    path: "book/wudao",
                    count: grade === 3 ? 6 : 10
                }, {
                    path: "book/bc#shenghuoshengong",
                    count: 25
                }];
            },
            format: (val: number) => {
                return "内力上限：+" + val;
            }
        },
        {
            prop: "shsg_hh",
            value: (lv: number) => 15,
            format: (val: number) => "圣火护体额外增加" + val + "%效果",
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 15,
                fy: lv * 1,
                limit_mp: lv * 100,
                desc: "唯一：将你内力的70%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        shenghuo:
            {
                name: "圣火护体",
                distime: 60000,
                enable_skill: "force",
                mp: 20,
                release_time: 500,
                use_type: 2,
                use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                    const per = 10 + Math.floor(lv / 100);
                    const time = (10 + Math.floor(lv / 100)) * 1000;
                    const add = me.query_prop("shsg_hh");
                    me.send_room("<hir>$N双臂一振，圣火真气透体而出，刹那间衣袍鼓荡，周身赤焰翻涌，明教圣火之威，焚天灼地！</hir>\n", target);
                    me.add_status({
                        id: "force",
                        name: "圣火",
                        desc: "提升你的攻击与防御",
                        duration: time,
                        prop: {
                            gj_per: per + add,
                            fy_per: per + add,
                        },
                        finish_msg: "$N周身圣火渐渐熄灭，真气归于丹田。",
                    });
                },
                query_desc: function (me: CHARACTER, lv: number) {
                    const per = 10 + Math.floor(lv / 100);
                    const time = (10 + Math.floor(lv / 100));
                    return "圣火真气护体，" + time + "秒内提升自身攻击防御" + per + "%。";
                }
            }
    };
}
