import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE;
this.inherits(EQUIPMENT);
this.set({
    unit: "枚",
    name: "琴中剑",
    desc: "衡山掌门莫大的琴中剑，护身用的",
    value: 10000,
    eq_type: EQUIP_TYPE.THROWING,
    grade: 2,
    hole_count: 1
});
this.prop = {
    gj: 40,
    fy:40
};
}
