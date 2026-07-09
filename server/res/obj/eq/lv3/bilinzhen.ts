import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
  unit = "枚";
  name = "碧磷针";
  desc = "星宿老仙的独门暗器";
  value = 200000;
  grade = 3;
  hole_count = 2;
  eq_type = EQUIP_TYPE.THROWING;
  weapon_type = WEAPON_TYPE.THROWING;
  prop: PropMap = {
    gj: 98,
    dex: 10,
    mz: 67,
  };
}
