import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
  name = "神龙袍";
  desc = "神龙教管理层的标准制服";
  unit = "件";
  grade = 2;
  hole_count = 1;
  eq_type = EQUIP_TYPE.CLOTH;
  value = 30000;
  prop: PropMap = {
    fy: 50,
    max_hp: 250,
    con: 10,
  };
}
