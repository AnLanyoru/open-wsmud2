import {SKILL} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "摘星功";
    id = "zhaixinggong";
    grade = 2;
    
    desc = "星宿派的轻功身法";
    can_enables = ["dodge"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: Math.floor(lv * 1.8),
                dex: Math.floor(lv * 0.26),
            },
        };
    }
}
