import { SKILL } from "../../../../core/skill/skill.js";
import { SKILL_TYPES } from "../../../../core/const.js";
import type {
  PerformData,
  EnablePropMap,
} from "../../../../core/skill/skill.js";
import type {
  CHARACTER,
  DoAttackPar,
} from "../../../../core/char/character.js";

export default class extends SKILL {
  name = "金雁功";
  id = "jinyangong";
  grade = 1;

  desc = "全真教的轻功身法";
  can_enables = ["dodge"];

  query_enable_prop(lv: number): EnablePropMap {
    return {
      dodge: {
        ds: lv * 1,
      },
    };
  }
}
