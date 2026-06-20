import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "五岳令旗";
    desc = "五岳剑派的令旗，目前由嵩山派代为掌管";
    value = 200000;
    grade = 3;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
    prop = {
        gj: 120,
        str: 12,
        limit_mp: 1000,
    };
}
