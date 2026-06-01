import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "神龙杖";
    desc = "这是神龙教教主的专用宝杖,由黄金打造，头部一个大大的龙头";
    unit = "把";
    grade = 2;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.STAFF;
    value = 100000;
    hole_count = 1;
    prop = {
        gj: 50,
        str: 12,
        zj:20,
        gjsd:-200
    };
}

