import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "踏雪寻梅";
    id = "taxuexunmei2";
    source_skill = "taxuexunmei";
    grade = 5;
    family = FAMILIES.SHASHOU;
    desc = "踏雪寻梅是杀手楼一种特别厉害的上乘轻功，即使穿着铁鞋踩在雪上，也不会留下一点脚印。";
    can_enables = ["dodge"];
    dodge_actions = SKILL.get("taxuexunmei")?.dodge_actions || [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: Math.floor(lv * 1.9) + 200,
                mz: Math.floor(lv * 1.7) + 10,
                dex: Math.floor(lv * 0.5) + 10,
                bj_per: 1 + int(lv / 300),
            },
        };
    }

    pfm_set: PerformData = {
        wuhen: {
            name: "无痕",
            distime: 45000,
            enable_skill: "dodge",
            mp: 30,
            release_time: 500,
            no_auto: true,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const time: number = wuhen_time(lv);
                const ds: number = wuhen_ds(lv);
                me.send_room("<hiw>$N身体急转，化为一道白光，虚幻不定的出现在$n的周围</hiw>\n", target);
                me.add_status({
                    id: "dodge",
                    name: "无痕",
                    desc: "免疫控制，躲闪大幅提升",
                    duration: time,
                    ig_control: true,
                    prop: {
                        ds_per: ds,
                    },
                    finish_msg: "$N的身形渐渐清晰，无痕之影消散。",
                });
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const ds: number = wuhen_ds(lv);
                return `${toSec(wuhen_time(lv))}秒内免疫控制，并增加${ds}%躲闪`;
            },
        },
    };
}

// ========== 公共计算函数 ==========

/** 无痕持续时间（毫秒） */
export function wuhen_time(lv: number): number {
    const t: number = 3000 + lv * 5;
    return t > 10000 ? 10000 : t;
}

/** 无痕躲闪百分比 */
export function wuhen_ds(lv: number): number {
    return 30 + int(lv / 100);
}
