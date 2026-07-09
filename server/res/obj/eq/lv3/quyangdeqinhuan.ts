import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
  unit = "枚";
  name = "曲洋的琴环";
  desc = "日月神教长老曲洋的琴环";
  value = 200000;
  grade = 3;
  hole_count = 2;
  eq_type = EQUIP_TYPE.JEWELS;
  prop: PropMap = {
    gj: 68,
    diff_fy_per: 5,
    bj_per: 2,
  };
}
