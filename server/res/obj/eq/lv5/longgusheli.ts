import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "个";
    name = "龙骨舍利";
    desc = "传说中天龙死亡后遗留的舍利";
    value = 1000000;
    grade = 5;
    eq_type = EQUIP_TYPE.JEWELS;
    prop = {
        con: 80,
        int: 50,
        fy: 300,
        max_hp: 8000,
        diff_sh_per: 8,
    };
}
