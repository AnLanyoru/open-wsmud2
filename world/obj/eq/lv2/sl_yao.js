import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    name = "神龙腰带";
    desc = "神龙教管理层的制服腰带";
    unit = "条";
    grade = 2;
    eq_type = EQUIP_TYPE.WAIST;
    hole_count = 1;
    prop = {
        fy: 18,
        dazuo_per:10
    };
}

