import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE;
this.inherits(EQUIPMENT);
this.set({
    name: "军服",
    desc: "官兵穿的衣服，虽然简陋但是实用",
    unit: "件",
    grade: 1,
    eq_type: EQUIP_TYPE.CLOTH,
    value: 10000,
    prop: {
        fy: 10,
        max_hp: 10
    }
});
}
