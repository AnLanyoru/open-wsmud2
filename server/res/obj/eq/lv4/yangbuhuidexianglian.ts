import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "条";
    name = "杨不悔的项链";
    desc = "悟性+35 根骨+30 身法+35 容貌+5";
    value = 500000;
    grade = 4;
    hole_count = 3;
    eq_type = EQUIP_TYPE.NECKLACE;
}
