import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default class extends EQUIPMENT {
    unit = "个";
    name = "鸟窝";
    desc = "一个不死木脱落的树皮风干后的剩下的坚丝制成的鸟窝，竟然可以穿到身上，只是有些漏风";
    value = 1000;
    eq_type = EQUIP_TYPE.CLOTH;
    prop = {
    fy: 550,
    desc:"这件衣服的材料非常轻盈，却韧性十足，坚逾精钢"
};
}

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
