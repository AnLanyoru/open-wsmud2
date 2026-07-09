import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
  unit = "条";
  name = "贾布的护腰锁";
  desc = "青龙堂堂主贾布的护腰锁";
  value = 200000;
  grade = 3;
  hole_count = 2;
  eq_type = EQUIP_TYPE.WAIST;
  prop: PropMap = {
    fy: 150,
    con: 20,
    max_hp: 2500,
  };
}
