import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type { EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "逍遥心法";
    id = "xiaoyaoxinfa";
    grade = 1;
    force_rad = 0.6;
    desc = "逍遥派的入门心法";
    family = FAMILIES.XIAOYAO;
    can_enables = ["force"];
    learn_condition = {
        skill: {
            force: 50
        }
    };

    query_enable_prop(lv): EnablePropMap {
        return {
            force: {
                max_hp: lv * 3 + 30,
                limit_mp: lv * 10,
                desc: "唯一：将你内力的60%转化为气血"
            }
        };
    }
}

