import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "方";
    name = "崆峒印";
    desc = "华山至宝";
    value = 5000000;
    grade = 6;
    eq_type = EQUIP_TYPE.JEWELS;
    prop = {
        fy: 200,
        str: 100,
        mz: 160,
        diff_fy_per: 10,
    };
}
