import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "条";
    name = "火龙腰带";
    desc = "使用鳄鱼皮和火龙皮做成的腰带，结实耐用";
    value = 200000;
    grade = 3;
    eq_type = EQUIP_TYPE.WAIST;
    prop = {
        fy: 130,
        zj: 100,
        max_hp: 1000,
    };
}
