import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "张";
    name = "磐石护符";
    desc = "以泰山神石雕刻而成，护身避灾";
    value = 200000;
    grade = 3;
    hole_count = 2;
    eq_type = EQUIP_TYPE.JEWELS;
    prop: PropMap = {
        fy: 250,
        max_hp: 2000,
        diff_sh_per: 3,
    };
}
