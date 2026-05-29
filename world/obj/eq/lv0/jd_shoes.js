import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default class extends EQUIPMENT {
    unit = "件";
    name = "家丁鞋";
    desc = "崔府家丁的统一制服";
    value = 3000;
    eq_type = EQUIP_TYPE.SHOES;
    prop = {
    fy: 3
};
}

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
