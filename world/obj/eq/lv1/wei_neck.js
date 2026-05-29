import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE;
this.inherits(EQUIPMENT);
this.set({
    unit: "条",
    name: "韦春芳的项链",
    desc: "估计是哪个恩客送给韦春芳的",
    value: 10000,
    eq_type: EQUIP_TYPE.NECKLACE,
    grade: 1
});
this.prop = {
    con: 3,
    per: 3
};
}
