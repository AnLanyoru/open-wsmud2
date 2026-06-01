import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "龙纹剑";
    desc = "黑色不明材质打造，通体龙纹鳞甲";
    unit = "把";
    grade = 3;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
    hole_count = 2;
    prop = {
        gj: 80,
        int: 10,
        add_sh_per: 2
    };
    group_name = "lm2";

    group_prop(count) {
    if (count == 3) {
        return {
            int: 10
        };
    } else if (count == 5) {
        return {
            lianxi_per: 15,
            dazuo_per: 15
        };
    }
}
}

