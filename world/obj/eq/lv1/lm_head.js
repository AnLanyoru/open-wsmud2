import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default class extends EQUIPMENT {
    name = "流氓巾";
    desc = "这是一条黑色的带子，随意束住头发，看上去有几分潇洒";
    unit = "件";
    grade = 1;
    eq_type = EQUIP_TYPE.HEAD;
    value = 10000;
    prop = {
        fy:2,
        max_hp:10
    };
}

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
