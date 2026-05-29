import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default class extends EQUIPMENT {
    unit = "枚";
    name = "铁戒指";
    desc = "一枚生铁打造的戒指，带上挺好看的";
    value = 1000;
    eq_type = EQUIP_TYPE.RING;
    prop = {
    gj: 1
};
}

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
