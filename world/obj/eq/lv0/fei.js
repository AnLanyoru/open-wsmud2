import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "飞镖";
    desc = "一把精钢打造的暗器飞镖";
    value = 2500;
    eq_type = EQUIP_TYPE.THROWING;
    prop = {
    gj: 3
};
}

