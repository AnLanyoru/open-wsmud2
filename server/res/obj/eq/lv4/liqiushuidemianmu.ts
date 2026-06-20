import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "个";
    name = "李秋水的面幕";
    desc = "李秋水被童姥毁容后一直带的面罩";
    value = 500000;
    grade = 4;
    eq_type = EQUIP_TYPE.HEAD;
    prop: PropMap = {
        gj: 128,
        add_sh_per: 10,
        mz_per: 3,
    };
}
