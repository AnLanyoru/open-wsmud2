import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "支";
    name = "簪子";
    desc = "一支木制的簪子，没什么钱钱的少女侠客最爱，当然道士也可以用";
    value = 1500;
    eq_type = EQUIP_TYPE.HEAD;
}

