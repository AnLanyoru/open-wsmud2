import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    unit = "件";
    name = "英雄巾";
    desc = "行走江湖男士标配装备，虽然没什么实际作用";
    value = 1500;
    eq_type = EQUIP_TYPE.HEAD;
}

