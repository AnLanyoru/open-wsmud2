import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "件";
    name = "盟主披风";
    desc = "五岳盟主左冷禅的披风";
    value = 200000;
    grade = 3;
    eq_type = EQUIP_TYPE.CAPE;
    prop = {
        con: 15,
        str: 15,
        dex: 15,
    };
}
