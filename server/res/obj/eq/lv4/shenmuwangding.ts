import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
  unit = "座";
  name = "神木王鼎";
  desc =
    "一个小小的木鼎，彤琢甚是精细，木质坚润似似玉，木理之中隐隐约约的泛出红丝。";
  value = 500000;
  grade = 4;
  hole_count = 3;
  eq_type = EQUIP_TYPE.JEWELS;
  prop: PropMap = {
    lianyao1: 6,
    hp_per: 10,
  };
  // Special effects: 增加你的化功大法练习速度
}
