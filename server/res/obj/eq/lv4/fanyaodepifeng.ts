import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "件";
    name = "范遥的披风";
    desc = "明教光明右使范遥的披风，";
    value = 500000;
    grade = 4;
    eq_type = EQUIP_TYPE.CAPE;
    prop = {
        fy: 198,
    };
    // Special effects: 穿上这件披风，别人看不到你
}
