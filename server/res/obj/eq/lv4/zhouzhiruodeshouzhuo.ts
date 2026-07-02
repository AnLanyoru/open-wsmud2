import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "只";
    name = "周芷若的手镯";
    desc = "明教教主张无忌随身携带的峨眉派周芷若的手镯";
    value = 500000;
    grade = 4;
    hole_count = 3;
    eq_type = EQUIP_TYPE.WRIST;
    prop: PropMap = {
        fy: 160,
        limit_mp: 2000,
        expend_mp_per: 10,
        con: 10,
    };
}
