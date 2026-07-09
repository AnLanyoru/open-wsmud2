import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
  unit = "双";
  name = "蒙古军靴";
  desc = "蒙古士兵的靴子";
  value = 10000;
  grade = 1;
  eq_type = EQUIP_TYPE.SHOES;
  prop: PropMap = {
    fy: 8,
    con: 1,
  };
}
