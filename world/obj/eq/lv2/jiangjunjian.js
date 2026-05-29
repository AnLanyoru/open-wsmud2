import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default class extends EQUIPMENT {
    name = "将军剑";
    desc = "扬州城守备自己定做的一把长剑，剑鞘粗犷，剑身却很精致，看来是花了不少功夫。";
    unit = "把";
    grade = 2;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
    value = 20000;
    hole_count = 1;
    prop = {
        gj: 20,
        str: 3
    };
}

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
const WEAPON_TYPE = globalThis.WEAPON_TYPE;
