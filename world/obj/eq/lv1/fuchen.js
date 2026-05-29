import { EQUIPMENT } from "../../../../os/item/equipment.js";

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

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
const WEAPON_TYPE = globalThis.WEAPON_TYPE;
