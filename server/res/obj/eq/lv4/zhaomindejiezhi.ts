import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "枚";
    name = "赵敏的戒指";
    desc = "不知道是赵敏给张无忌的，还是张无忌准备给赵敏的";
    value = 500000;
    grade = 4;
    eq_type = EQUIP_TYPE.RING;
    prop: PropMap = {
        add_sh_per: 3,
        diff_fy_per: 3,
        mz: 180,
        distime_per: 3,
    };
}
