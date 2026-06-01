import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "疤面面具";
    desc = "何红药的疤面面具，狰狞恐怖";
    unit = "件";
    grade = 2;
    eq_type = EQUIP_TYPE.HEAD;
    value = 30000;
    hole_count = 2;
    prop = {
        per: -20,
        add_sh_per: 8
    };
}

