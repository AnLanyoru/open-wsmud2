import {SKILL} from "../../../../core/skill/skill.js";
import type { EnablePropMap } from "../../../../core/skill/skill.js";

// ============================================================
// 天南步 — 大理段家高级轻功
// ============================================================

export default class extends SKILL {
    name = "天南步";
    id = "tiannanbu";
    grade = 2;

    desc = "大理段家的轻功身法，步法轻灵优雅，暗合易理，进退之间自有一股雍容华贵之气。";
    can_enables = ["dodge"];
    dodge_actions = [
        "$n微微一笑，足下轻轻一点，身形如行云流水般向后飘去，正是大理段家「天南步」的精妙身法。",
        "但见$n袍袖轻拂，步法倏变，已踏出「天南步」中的凌波微步之势，$N一击落空。",
        "$n不慌不忙，左足踏出半步，身形顺势一侧，$N的攻势贴着$n衣袂而过。",
        "$n足尖轻旋，整个人如陀螺般滴溜溜一转，竟从$N的招式缝隙间闪了过去。",
        "只见$n身形一矮，随即向后弹射而出，姿态飘逸如仙鹤展翅，$N这一招尽数落空。",
        "$n步履从容，身形微侧间已踏出了丈余，段家「天南步」果然名不虚传。",
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: 30 + Math.floor(lv * 8 / 5),
                int: Math.floor(lv / 6),
            },
        };
    }
}
