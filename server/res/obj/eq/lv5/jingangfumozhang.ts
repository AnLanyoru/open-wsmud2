import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";
import type {PropMap} from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "根";
    name = "金刚伏魔杖";
    desc = "佛家神器。";
    value = 1000000;
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.STAFF;
    prop: PropMap = {
        gj: 560,
        mz: 550,
        str: 82,
        add_sh_per: 6,
        zj_per: 7,
    };
}
