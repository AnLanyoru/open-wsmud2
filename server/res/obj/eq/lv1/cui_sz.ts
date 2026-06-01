import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "副";
    name = "崔莺莺的手镯";
    desc = "一副翡翠做的手镯，可能是崔莺莺的情郎送给她的定情信物";
    value = 10000;
    eq_type = EQUIP_TYPE.WRIST;
    grade = 2;
    prop = {
    gjsd: 200,
    int: 10,
    per:2
};
}

