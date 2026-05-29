import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "军刀";
    desc = "一把精钢打造的长刀";
    value = 12500;
    grade = 1;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.BLADE;
    prop = {
gj:10,
str:2
};
}

