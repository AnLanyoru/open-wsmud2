import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default class extends EQUIPMENT {
    unit = "件";
    name = "布衣";
    desc = "杨记出产的布衣，结实耐用";
    value = 1000;
    eq_type = EQUIP_TYPE.CLOTH;
    prop = {
    fy: 1
};
}

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
