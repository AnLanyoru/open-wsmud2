import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default class extends EQUIPMENT {
    name = "黑虎单刀";
    desc = "一把短柄的砍刀，看上去锋利异常";
    unit = "把";
    grade = 1;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.BLADE;
    value = 20000;
    prop = {
        gj: 20,
        str: 3
    };
}

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
const WEAPON_TYPE = globalThis.WEAPON_TYPE;
