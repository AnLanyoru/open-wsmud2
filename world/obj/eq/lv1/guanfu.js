import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default class extends EQUIPMENT {
    name = "官服";
    desc = "一件朝廷命官穿着的官服，上面用金丝线绣着一些花纹。";
    unit = "件";
    grade = 1;
    eq_type = EQUIP_TYPE.CLOTH;
    value = 10000;
    prop = {
        fy: 15,
        max_hp: 20
    };
}

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
