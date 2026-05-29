import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    unit = "根";
    name = "流氓闷棍";
    desc = "这是城外流氓打架斗殴的标配";
    value = 2500;
    grade = 1;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.CLUB;
    prop = {
   gj: 10,
    zj: 7
};
}

