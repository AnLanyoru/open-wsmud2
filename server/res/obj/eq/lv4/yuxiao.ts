import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "玉箫";
    desc = "东邪黄药师的玉箫";
    value = 500000;
    grade = 4;
    hole_count = 3;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
    prop: PropMap = {
        gj: 200,
        dex: 35,
        distime_per: 7,
        releasetime_per: 7,
    };
}
