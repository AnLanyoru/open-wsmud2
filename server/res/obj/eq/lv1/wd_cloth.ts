import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "武当道袍";
    desc = "这是武当派正式弟子的标准装束。";
    unit = "件";
    grade = 1;
    eq_type = EQUIP_TYPE.CLOTH;
    value = 10000;
    prop = {
        fy: 10,
        con:2
    };
}

