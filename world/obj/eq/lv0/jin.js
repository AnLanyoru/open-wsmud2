import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE;
this.inherits(EQUIPMENT);
this.set({
    unit: "件",
    name: "英雄巾",
    desc: "行走江湖男士标配装备，虽然没什么实际作用",
    value: 1500,
    eq_type: EQUIP_TYPE.HEAD,
});
}
