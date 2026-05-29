import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default class extends EQUIPMENT {
    unit = "双";
    name = "布鞋";
    desc = "寻常的布鞋，结实耐磨";
    value = 1000;
    eq_type = EQUIP_TYPE.SHOES;
    prop = {
    fy: 1
};
}

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
