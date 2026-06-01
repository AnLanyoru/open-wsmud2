import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "拂尘";
    desc = "这是一柄拂尘，整体素白";
    unit = "柄";
    grade = 1;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.WHIP;
    value = 10000;
    prop = {
        gj: 8,
        mz: 2
    };
}

