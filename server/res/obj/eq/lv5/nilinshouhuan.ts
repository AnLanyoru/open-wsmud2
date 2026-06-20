import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "只";
    name = "逆鳞手环";
    desc = "龙之逆鳞，触者杀之";
    value = 1000000;
    grade = 5;
    eq_type = EQUIP_TYPE.WRIST;
    prop = {
        fy: 200,
        str: 100,
        mz: 160,
        diff_fy_per: 10,
    };
}
