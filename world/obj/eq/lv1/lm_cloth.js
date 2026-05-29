import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    name = "流氓衣";
    desc = "这是一件劲装，看上去叼叼的，虽然有些非主流";
    unit = "件";
    grade = 1;
    eq_type = EQUIP_TYPE.CLOTH;
    value = 10000;
    prop = {
        fy: 8,
        max_hp: 10
    };
}

