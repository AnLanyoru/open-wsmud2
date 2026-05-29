import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default class extends EQUIPMENT {
    name = "金鋘钩";
    desc = "何铁手的假手，形似钩状，如纤纤女手";
    unit = "副";
    grade = 2;
    eq_type = EQUIP_TYPE.WRIST;
    value = 30000;
    hole_count = 2;
    prop = {
        gj: 20,
        zj: 20
    };
}

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
