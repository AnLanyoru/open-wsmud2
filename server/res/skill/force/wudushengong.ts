import {SKILL} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "五毒神功";
    id = "wudushengong";
    grade = 2;
    
    desc = "五毒教的内功心法";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: 8000,
                fy: 1000,
                limit_mp: 55000,
                desc: "唯一将你内力的70%转化为气血",
            },
        };
    }
}
