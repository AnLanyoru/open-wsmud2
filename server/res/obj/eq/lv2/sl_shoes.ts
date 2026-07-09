import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
  name = "神龙靴";
  desc = "神龙教管理层的制服靴子";
  unit = "件";
  grade = 2;
  hole_count = 1;
  eq_type = EQUIP_TYPE.SHOES;
  value = 30000;
  prop: PropMap = {
    fy: 25,
    max_hp: 180,
    dex: 6,
  };
}
