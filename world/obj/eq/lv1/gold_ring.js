import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE;
this.inherits(EQUIPMENT);
this.set({
    unit: "枚",
    name: "崔员外的戒指",
    desc: "一枚金子打造的戒指,有点粗",
    value: 10000,
    eq_type: EQUIP_TYPE.RING,
    grade: 1
});
this.prop = {
    gj: 2,
    mz: 2
};
}
