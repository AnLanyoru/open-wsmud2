import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "温仪的香囊";
    desc = "金蛇郎君夏雪宜送给温仪的定情信物";
    unit = "个";
    grade = 2;
    eq_type = EQUIP_TYPE.JEWELS;
    value = 30000;
    prop = {
        ds:44,
        releasetime:1000,
    };
}

