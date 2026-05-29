import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "钢刀";
    desc = "一把精钢打造的长刀";
    value = 2500;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.BLADE;
    prop = {
gj:2
};
}

