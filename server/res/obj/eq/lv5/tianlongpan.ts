import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
  unit = "条";
  name = "天龙鞶";
  desc = "不细看你还以为是一条龙";
  value = 1000000;
  grade = 5;
  hole_count = 4;
  eq_type = EQUIP_TYPE.WAIST;
  prop: PropMap = {
    fy: 5,
    dex: 100,
    hp_per: 5,
  };
}
