import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE;
this.inherits(EQUIPMENT);
this.set({
    name: "神龙靴",
    desc: "神龙教管理层的制服靴子",
    unit: "件",
    grade: 2,
    eq_type: EQUIP_TYPE.SHOES,
    value: 30000,
    hole_count:1,
    prop: {
        fy: 25,
        max_hp:180,
        dex: 6
    }
});
}
