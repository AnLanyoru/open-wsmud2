import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default class extends EQUIPMENT {
    name = "金丝宝甲";
    desc = "这是一件金丝做成的甲衣，据说可以刀枪不入";
    unit = "件";
    grade = 2;
    eq_type = EQUIP_TYPE.CLOTH;
    value = 100000;
    hole_count = 1;
    prop = {
        fy: 25,
        max_hp: 100,
        diff_sh:50
    };
}

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
