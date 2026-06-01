import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "侠客冠";
    desc = "江湖中很流行的侠客侠女套装，做工精美，这是一顶冠带";
    unit = "顶";
    grade = 1;
    eq_type = EQUIP_TYPE.HEAD;
    value = 100000;
    prop = {
        fy: 6,
        int: 2
    };
}

