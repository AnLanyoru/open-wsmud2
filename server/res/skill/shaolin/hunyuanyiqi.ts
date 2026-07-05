import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type { EnablePropMap } from "../../../core/skill/skill.js";
import type { LearnCondition } from "../../../types/events.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "混元一气";
    id = "hunyuanyiqi";
    grade = 1;
    force_rad = 0.55;
    desc = "少林寺的内功心法";
    family = FAMILIES.SHAOLIN;
    can_enables = ["force"];
    learn_condition: LearnCondition = {
        skill: {
            force: 50
        }
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv,
                fy: lv + 5,
                limit_mp: lv * 20,
                desc: "唯一：将你内力的55%转化为气血"
            }
        };
    }
}

