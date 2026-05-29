import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default class extends EQUIPMENT {
    name = "流氓护腕";
    desc = "这是一条黑色的不知道什么动物的皮制成的护腕，已经被磨的铮亮";
    unit = "件";
    grade = 1;
    eq_type = EQUIP_TYPE.WRIST;
    value = 10000;
    prop = {
        dex: 1,
        gjsd: 100
    };
}

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
