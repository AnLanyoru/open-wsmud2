import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "龙纹靴";
    desc = "鞋面用黑龙筋编织出防滑纹路";
    unit = "件";
    grade = 2;
    eq_type = EQUIP_TYPE.SHOES;
    hole_count = 1;
    prop = {
        fy: 21,
        int: 10
    };
    group_name = "lm2";

    group_prop(count) {
    if (count == 3) {
        return {
            int: 10
        };
    } else if (count == 5) {
        return {
            lianxi_per: 15,
            dazuo_per: 15
        };
    }
}
}

