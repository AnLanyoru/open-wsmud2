import {SKILL} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "天南步";
    id = "tiannanbu";
    grade = 2;
    
    desc = "大理段家的轻功身法";
    can_enables = ["dodge"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: Math.floor(lv * 1.63),
                int: Math.floor(lv * 0.166),
            },
        };
    }
}
