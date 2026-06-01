import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "武当长剑";
    desc = "武当正式弟子的配剑，剑身长而窄，灵动飘逸";
    unit = "把";
    grade = 1;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
    value = 20000;
    prop = {
        gj: 15,
        int: 3
    };
}

