import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE;
this.inherits(EQUIPMENT);
this.set({
    name: "侠客靴",
    desc: "江湖中很流行的侠客侠女套装，这是其中一双靴子，可以看出做工很讲究，好看又实用。",
    unit: "双",
    grade: 1,
    eq_type: EQUIP_TYPE.SHOES,
    value: 100000,
    prop: {
        fy: 5,
        dex: 2
    }
});
}
