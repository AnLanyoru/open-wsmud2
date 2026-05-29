import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    name = "金蛇锥";
    desc = "金蛇郎君的独门暗器，形状奇特";
    unit = "个";
    grade = 1;
    eq_type = EQUIP_TYPE.THROWING;
    value = 20000;
    prop = {
        gj: 8,
        mz:5
    };
}

