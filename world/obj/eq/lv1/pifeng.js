import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    name = "员外披肩";
    desc = "这是扬州城最近有钱人流行穿的款式，上好的杭州白编绫，用金丝秀满了钱币";
    unit = "件";
    grade = 1;
    eq_type = EQUIP_TYPE.CAPE;
    value = 20000;
    prop = {
        fy: 5,
        max_hp:30
    };
}

