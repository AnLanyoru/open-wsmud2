import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "件";
    name = "上官云的披风";
    desc = "白虎堂堂主上官云的披风，";
    value = 200000;
    grade = 3;
    eq_type = EQUIP_TYPE.CAPE;
    prop = {
        fy: 98,
        ds: 90,
        diff_bj: 2,
    };
}
