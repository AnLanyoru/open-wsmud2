import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "短衣劲装";
    desc = "看上去很精干的一件衣服，穿上去利落无比";
    unit = "件";
    grade = 1;
    eq_type = EQUIP_TYPE.CLOTH;
    value = 10000;
    prop = {
        fy: 8,
        str: 1
    };
}

