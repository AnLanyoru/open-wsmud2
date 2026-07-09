import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
  unit = "根";
  name = "玉竹杖";
  desc = "一根泛着淡淡青光的竹杖，是历代丐帮帮主的信物。";
  value = 500000;
  grade = 4;
  hole_count = 3;
  eq_type = EQUIP_TYPE.WEAPON;
  weapon_type = WEAPON_TYPE.STAFF;
  prop: PropMap = {
    gj: 310,
    dex: 30,
    ds: 290,
    zj: 290,
    diff_fy_per: 5,
  };
}
