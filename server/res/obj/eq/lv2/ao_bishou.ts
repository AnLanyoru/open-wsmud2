import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "鳌拜匕首";
    desc = "这是鳌拜收藏的一把匕首，剑身如墨，无半点光泽。";
    unit = "柄";
    grade = 2;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
    value = 20000;
    hole_count = 1;
    prop = {
        gj: 30,
        dex:5,
        add_sh_per:2
    };
}

