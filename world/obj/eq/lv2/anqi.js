import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    name = "大冬瓜";
    desc = "这是一种暗器，丢出去可以砸人。";
    unit = "个";
    grade = 2;
    eq_type = EQUIP_TYPE.THROWING;
    value = 20000;
    hole_count = 1;
    prop = {
        gj: 18,
        gjsd: -1000,
        add_sh_per:5
    };
}

