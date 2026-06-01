import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "长鞭";
    desc = "这是一柄普通的长鞭";
    unit = "柄";
    eq_msg = "$N「唰」的一声抖出一柄$n握在手中。";
    uneq_msg = "$N将手中的$n卷回腰间。";
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.WHIP;
    value = 1000;
    prop = {
        gj: 3
    };
}

