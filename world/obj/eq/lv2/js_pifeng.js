import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default class extends EQUIPMENT {
    name = "金蛇披风";
    desc = "一件暗金色的披风，";
    unit = "件";
    grade = 2;
    eq_type = EQUIP_TYPE.CAPE;
    value = 20000;
    hole_count = 1;
    prop = {
        fy: 35,
        max_hp: 300
    };
}

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
