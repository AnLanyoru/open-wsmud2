import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "枚";
    name = "琴中剑";
    desc = "衡山掌门莫大的琴中剑，护身用的";
    value = 10000;
    eq_type = EQUIP_TYPE.THROWING;
    grade = 2;
    hole_count = 1;
    prop = {
    gj: 40,
    fy:40
};
}

