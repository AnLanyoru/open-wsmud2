import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE;
this.inherits(EQUIPMENT);
this.set({
    name: "神龙冠",
    desc: "神龙教管理层的制服帽子",
    unit: "件",
    grade: 2,
    eq_type: EQUIP_TYPE.HEAD,
    value: 30000,
    hole_count:1,
    prop: {
        fy: 30,
        max_hp: 200,
        con:5
    }
});
}
