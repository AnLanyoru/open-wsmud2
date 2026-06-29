import {SKILL} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PropMap} from "../../../types/props.js";

export default class extends SKILL {
    name = "临水经";
    id = "linshuijing";
    grade = 1;
    family = FAMILIES.WULANG;
    type = SKILL_TYPES.KNOWLEDGE;
    desc = "传闻是无浪门前辈从秘境发现的神秘口诀，学会后明显提升你的钓鱼技巧\n当你加入无浪门后通过钓鱼就能提升等级";
    can_enables = [];

    query_prop(lv: number): PropMap {
        return {diaoyu1: Math.floor(lv / 300) + 1};
    }
}
