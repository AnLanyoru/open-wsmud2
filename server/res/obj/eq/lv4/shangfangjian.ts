import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
  name = "尚方宝剑";
  desc = "一把御赐尚方宝剑，剑身寒光闪闪，上斩昏君，下斩谗臣。";
  unit = "把";
  grade = 4;
  hole_count = 3;
  eq_type = EQUIP_TYPE.WEAPON;
  weapon_type = WEAPON_TYPE.SWORD;
  prop: PropMap = {
    gj: 1,
  };
}
