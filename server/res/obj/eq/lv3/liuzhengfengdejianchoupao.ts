import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "件";
    name = "刘正风的茧绸袍";
    desc = "一件酱色的茧绸袍子，端庄华丽";
    value = 200000;
    grade = 3;
    eq_type = EQUIP_TYPE.CLOTH;
    prop = {
        fy: 200,
        con: 22,
        per: 2,
    };
}
