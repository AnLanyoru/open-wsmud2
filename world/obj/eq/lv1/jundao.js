import { EQUIPMENT } from "../../../../os/item/equipment.js";

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

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
const WEAPON_TYPE = globalThis.WEAPON_TYPE;
