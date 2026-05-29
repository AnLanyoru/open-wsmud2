import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    name = "龙纹服";
    desc = "以黑龙皮鞣制而成的紧身劲装，表面覆盖着细密的黑色鳞片，阳光下泛着暗紫色光泽。";
    unit = "件";
    grade = 2;
    eq_type = EQUIP_TYPE.CLOTH;
    hole_count = 1;
    prop = {
        fy: 30,
        int: 10,
        lianxi_per: 8
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

