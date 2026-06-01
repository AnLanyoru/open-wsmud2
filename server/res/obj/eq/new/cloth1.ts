import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "件";
    name = "粗布衣";
    desc = "新手衣服，不值钱";
    value = 0;
    eq_type = EQUIP_TYPE.CLOTH;
}

