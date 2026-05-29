import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE;
this.inherits(EQUIPMENT);
this.set({
    name: "流氓鞋",
    desc: "这是一件褐色的皮靴，看上去叼叼的，虽然有些非主流",
    unit: "件",
    grade: 1,
    eq_type: EQUIP_TYPE.SHOES,
    value: 10000,
    prop: {
        fy: 5,
        dex: 1
    }
});
}
