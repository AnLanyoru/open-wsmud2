import {SKILL} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "观山诀";
    id = "guanshanjue";
    grade = 1;
    family = FAMILIES.WULANG;
    desc = "传闻是无浪门前辈从秘境发现的神秘口诀，远观山势辨矿脉，近循山理通经脉，融天地与自身为一的玄妙法门。";
    can_enables = [];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            // Global/base properties:
            // {} 挖矿效率+4
        };
    }
}
