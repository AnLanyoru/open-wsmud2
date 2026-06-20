import {SKILL} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "身空行";
    id = "shenkongxing";
    grade = 2;
    
    desc = "血刀门的轻功身法";
    can_enables = ["dodge"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: Math.floor(lv * 2.1),
                con: Math.floor(lv * 0.21),
            },
        };
    }
}
