import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
  unit = "件";
  name = "蒙古军服";
  desc = "蒙古士兵穿的军服";
  value = 10000;
  grade = 1;
  eq_type = EQUIP_TYPE.CLOTH;
  prop: PropMap = {
    fy: 10,
    max_hp: 50,
  };
}
