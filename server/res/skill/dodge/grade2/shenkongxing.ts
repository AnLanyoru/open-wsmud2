import {SKILL} from "../../../../core/skill/skill.js";
import type { EnablePropMap } from "../../../../core/skill/skill.js";

// ============================================================
// 身空行 — 血刀门高级轻功
// ============================================================

export default class extends SKILL {
    name = "身空行";
    id = "shenkongxing";
    grade = 2;

    desc = "血刀门的轻功身法，身形如鬼魅般飘忽，踏雪无痕，来去如风。";
    can_enables = ["dodge"];
    dodge_actions = [
        "却见$n身形一晃，足不沾尘，一式「踏雪无痕」轻轻巧巧地避开了$N这一招。",
        "$n不待$N招式使老，早已飘身疾退，血刀门轻功「身空行」果然名不虚传。",
        "只见$n袍袖轻拂，身形如鬼魅般向后飘出丈余，$N一击落空。",
        "$n双足微点，一式「凌虚飞渡」，倏地拔起数丈，$N的攻击尽数落空。",
        "但见$n身形滴溜溜一转，竟从$N的攻势间隙中穿了过去，好一招「如影随形」。",
        "$n沉肩坠肘，足下无声无息地向后滑开，$N只觉眼前一花，$n已在数尺之外。",
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: 100 + lv * 2,
                con: 10 + Math.floor(lv / 5),
            },
        };
    }
}
