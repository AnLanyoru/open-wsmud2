import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "盘古斧";
    desc = "传说中盘古开天辟地时候使用的一把斧头";
    value = 5000000;
    grade = 6;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.STAFF;
    prop = {
        gj: 910,
        str: 250,
        add_sh_per: 12,
        diff_fy_per: 20,
        add_bjsh_per: 50,
        gjsd: -1000,
    };
    // Special effects: 命中后降低对方战斗属性30%
}
