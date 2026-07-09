import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
  unit = "根";
  name = "蒙古枪";
  desc = "蒙古士兵的武器";
  value = 10000;
  grade = 1;
  eq_type = EQUIP_TYPE.WEAPON;
  weapon_type = WEAPON_TYPE.CLUB;
  prop: PropMap = {
    gj: 20,
  };
}
