import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE;
this.inherits(EQUIPMENT);
this.set({
    unit: "枚",
    name: "铁戒指",
    desc: "一枚生铁打造的戒指，带上挺好看的",
    value: 1000,
    eq_type: EQUIP_TYPE.RING,
});
this.prop = {
    gj: 1
};
}
