import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap} from "../../../core/skill/skill.js";
import type {CHARACTER, CharacterStatus} from "../../../core/char/character.js";

export default class extends SKILL {
    name = "诸天化身步";
    id = "zhutianbu3";
    source_skill = "zhutianbu2";
    grade = 6;
    family = FAMILIES.EMEI;
    is_hidden = true;

    desc = "峨眉派轻功身法，如有千万化身。";
    can_enables = ["dodge"];

    slots = [
        {
            prop: "ztb_wf_clear",
            value: (_lv: number) => 1,
            format: (_val: number) => "万佛化身开启后会清理自身异常状态",
        },
        {
            prop: "ztb_wf_res",
            value: (_lv: number) => 10,
            format: (val: number) => "万佛化身额外增加" + val + "%负面抵抗",
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: lv * 3,
                con: 2 + Math.floor(lv * 0.25),
                dex: 2 + Math.floor(lv * 0.25),
            },
        };
    }

    pfm_set: PerformData = {
        wanfo: {
            name: "万佛化身",
            distime: 30000,
            enable_skill: "dodge",
            mp: 20,
            release_time: 500,
            use: function (me: CHARACTER, _target: CHARACTER, lv: number): void {
                const extraRes = me.query_prop("ztb_wf_res");
                const res = lv + extraRes;

                // 槽位：清理自身异常状态
                if (me.query_prop("ztb_wf_clear")) {
                    me.remove_statuses((s: CharacterStatus) => s.downside === true);
                }

                me.send_room(
                    "<hio>$N身形一晃，无数化身纷至沓来，如万佛降临！</hio>",
                );
                me.add_status({
                    id: "dodge",
                    name: "万佛化身",
                    duration: 10000,
                    prop: {
                        diff_downside_per: res,
                    },
                    finish_msg: "$N的万佛化身渐渐消散。",
                });
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                return "增加自己" + lv + "%的负面抵抗，持续10秒。";
            },
        },
    };
}
