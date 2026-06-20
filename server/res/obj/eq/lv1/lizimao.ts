import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "顶";
    name = "笠子帽";
    desc = "蒙古士兵戴的帽子";
    value = 10000;
    grade = 1;
    eq_type = EQUIP_TYPE.HEAD;
    prop = {
        fy: 8,
    };
}
