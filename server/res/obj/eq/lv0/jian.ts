import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "铁剑";
    desc = "一把生铁打造的剑";
    value = 2000;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
    prop = {
    gj: 1
};
}

