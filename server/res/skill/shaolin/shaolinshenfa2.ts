import { SKILL } from "../../../core/skill/skill.js";
import { SKILL_TYPES } from "../../../core/const.js";
import { FAMILIES } from "../../../core/skill/family.js";
import type { PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { SkillSlotDef } from "../../../types/props.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
  name = "一苇渡江";
  id = "shaolinshenfa2";
  source_skill = "shaolinshenfa";
  grade = 4;
  family = FAMILIES.SHAOLIN;
  desc =
    "少林派至高轻功身法，相传为达摩祖师一苇渡江所创，身形灵动飘忽，瞬息千里";
  can_enables = ["dodge"];
  slots: SkillSlotDef[] = [
    {
      prop: "ywdj_ds",
      value: (lv: number) => 10,
      format: (val: number) => "一苇渡江最大可叠加层数：+" + val,
    },
    {
      prop: "ywdj_cd",
      value: (lv: number) => 10,
      format: (val: number) => "一苇渡江的内置冷却减少" + toSec(val) + "秒",
    },
  ];

  query_enable_prop(lv: number): EnablePropMap {
    return {
      dodge: {
        ds: Math.floor(lv * 1.81),
        str: 4 + Math.floor(lv * 0.25),
        dex: 4 + Math.floor(lv * 0.25),
        desc: "当你躲闪失败会增加你1000防御，可叠加10层",
      },
    };
  }
}
