import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "个";
    name = "移花宫装";
    desc = "移花宫女弟子的装束，华丽而优雅";
    value = 500000;
    grade = 4;
    eq_type = EQUIP_TYPE.JEWELS;
    prop: PropMap = {
        fy: 300,
        max_hp: 1550,
        fy_per: 10,
        per: 5,
    };
}
