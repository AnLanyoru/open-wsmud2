import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    name = "侠客衫";
    desc = "江湖中很流行的侠客侠女套装，做工精美，虽不华丽但也光鲜";
    unit = "件";
    grade = 1;
    eq_type = EQUIP_TYPE.CLOTH;
    value = 100000;
    prop = {
        fy: 10,
        con: 2
    };
}

