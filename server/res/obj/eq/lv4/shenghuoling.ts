import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
  unit = "块";
  name = "圣火令";
  desc = "一块非金非木的牌子，坚硬异常";
  value = 500000;
  grade = 4;
  hole_count = 3;
  eq_type = EQUIP_TYPE.JEWELS;
  prop: PropMap = {
    fy: 350,
    con: 30,
    max_hp: 2000,
  };
}
