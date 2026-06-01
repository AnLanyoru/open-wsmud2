import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "神龙护腕";
    desc = "神龙教管理层的制服护腕";
    unit = "件";
    grade = 2;
    eq_type = EQUIP_TYPE.WRIST;
    value = 30000;
    hole_count = 1;
    prop = {
        fy: 18,
        str:5
    };
}

