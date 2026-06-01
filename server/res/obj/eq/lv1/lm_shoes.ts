import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "流氓鞋";
    desc = "这是一件褐色的皮靴，看上去叼叼的，虽然有些非主流";
    unit = "件";
    grade = 1;
    eq_type = EQUIP_TYPE.SHOES;
    value = 10000;
    prop = {
        fy: 5,
        dex: 1
    };
}

