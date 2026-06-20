import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "根";
    name = "八卦棍";
    desc = "温家老五的独门兵器";
    value = 200000;
    grade = 3;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.CLUB;
    prop: PropMap = {
        gj: 90,
        zj: 90,
        con: 10,
    };
}
