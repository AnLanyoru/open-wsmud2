import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "龙纹冠";
    desc = "用黑龙额骨打磨成型的头饰";
    unit = "顶";
    grade = 2;
    eq_type = EQUIP_TYPE.HEAD;
    hole_count = 1;
    prop = {
        fy: 20,
        int: 10,
        dazuo_per: 8
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

