import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    name = "黑龙鞭";
    desc = "这是一柄墨黑长鞭，坚韧无比。是史松的成名武器";
    unit = "柄";
    eq_msg = "$N「唰」的一声抖出一柄$n握在手中。";
    uneq_msg = "$N将手中的$n卷回腰间。";
    grade = 2;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.WHIP;
    value = 100000;
    hole_count = 1;
    prop = {
        gj: 30,
        mz: 13,
        busy:500
    };
}

