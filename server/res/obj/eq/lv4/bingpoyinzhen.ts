import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "枚";
    name = "冰魄银针";
    desc = "古墓派的独门暗器";
    value = 500000;
    grade = 4;
    hole_count = 3;
    eq_type = EQUIP_TYPE.THROWING;
    weapon_type = WEAPON_TYPE.THROWING;
    prop: PropMap = {
        gj: 128,
        con: 12,
        mz: 112,
        diff_fy_per: 5,
    };
}
