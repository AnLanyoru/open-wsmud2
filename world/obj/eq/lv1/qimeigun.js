import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    unit = "根";
    name = "齐眉棍";
    desc = "此棍竖直与人眉齐高，是军中常用棍";
    value = 2500;
    grade = 1;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.CLUB;
    prop = {
     gj: 12,
        str: 4
};
}

