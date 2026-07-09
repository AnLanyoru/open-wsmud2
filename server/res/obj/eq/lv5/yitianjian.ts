import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
  unit = "把";
  name = "倚天剑";
  desc =
    "武林至尊，宝刀屠龙。号令天下，莫敢不从。倚天不出，谁与争锋！这就是号令天下的倚天剑";
  value = 1000000;
  grade = 5;
  hole_count = 4;
  eq_type = EQUIP_TYPE.WEAPON;
  weapon_type = WEAPON_TYPE.BLADE;
  prop: PropMap = {
    gj: 500,
    int: 60,
    add_sh_per: 6,
    bj_per: 4,
  };
  // Special effects: 攻击时有几率无视对方防御
}
