import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    unit = "件";
    name = "家丁服";
    desc = "崔府家丁的统一制服";
    value = 5000;
    eq_type = EQUIP_TYPE.CLOTH;
    prop = {
    fy: 5
};
}

