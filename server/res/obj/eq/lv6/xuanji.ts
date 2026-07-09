import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
  unit = "个";
  name = "璇玑";
  desc = "滉漾明光，三千乐指，仙之至宝";
  value = 5000000;
  grade = 6;
  hole_count = 5;
  eq_type = EQUIP_TYPE.JEWELS;
  prop: PropMap = {
    str: 80,
    con: 80,
    dex: 80,
    per: 10,
    hp_per: 10,
    fy_per: 10,
  };
}
