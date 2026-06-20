import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "双";
    name = "天龙逐日靴";
    desc = "天龙套装的靴子，穿上它可以追风逐日";
    value = 1000000;
    grade = 5;
    eq_type = EQUIP_TYPE.SHOES;
    prop = {
        fy: 380,
        ds: 200,
        ds_per: 3,
        diff_busy_per: 10,
    };
}
