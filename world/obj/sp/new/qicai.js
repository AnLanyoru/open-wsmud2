import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default class extends EQUIPMENT {
    unit = "件";
    name = "<hig>七彩天岚衣<hig>";
    desc = "";
    value = 0;
    eq_type = EQUIP_TYPE.CLOTH;
}

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
