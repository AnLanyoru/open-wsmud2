import { SKILL } from "../../../../core/skill/skill.js";
import type { EnablePropMap } from "../../../../core/skill/skill.js";

export default class extends SKILL {
  name = "穿云纵";
  id = "chuanyunzong";
  grade = 2;
  desc = "衡山派的轻功步法。";
  can_enables = ["dodge"];
  learn_condition = {
    max_mp: 10000,
    skill: {
      dodge: 500,
    },
  };

  query_enable_prop(lv: number): EnablePropMap {
    return {
      dodge: {
        ds: parseInt(lv * 1.6) + 160,
        dex: parseInt(lv / 7),
      },
    };
  }
}
