import {SKILL} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "缩地成寸";
    id = "suodichengcun  ";
    grade = 5;
    
    desc = "蜀山玄门身法，传闻练到极致可一步千里，凭空瞬移，隐迹藏形。";
    can_enables = ["dodge"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: 2310,
                gj: 1910,
                fy: 1910,
                gj_per: 8,
                fy_per: 8,
                desc: "躲闪失败后会额外增加一次躲闪判定，并增加10%有效值",
            },
        };
    }
}
