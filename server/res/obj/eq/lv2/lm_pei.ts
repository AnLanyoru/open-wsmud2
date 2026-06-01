import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "龙纹玉佩";
    desc = "墨玉质地，表面刻着盘旋的五爪金龙，龙鳞纹路清晰可辨。";
    unit = "块";
    grade = 2;
    eq_type = EQUIP_TYPE.JEWELS;
    hole_count = 1;
    prop = {
        study_per: 10,
        int: 12
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

