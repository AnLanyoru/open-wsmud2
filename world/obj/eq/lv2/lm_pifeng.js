import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    name = "龙纹披风";
    desc = "以黑龙皮膜制成，边缘缀着七枚龙鳞甲片，展开时如黑龙展翅。";
    unit = "件";
    grade = 2;
    eq_type = EQUIP_TYPE.CAPE;
    value = 20000;
    hole_count = 1;
    prop = {
        limit_mp: 500,
        dazuo_per: 10
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

