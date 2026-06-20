import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "只";
    name = "邀月的手镯";
    desc = "移花宫大宫主邀月的手镯";
    value = 200000;
    grade = 3;
    eq_type = EQUIP_TYPE.WRIST;
    prop: PropMap = {
        fy: 60,
        releasetime: 1000,
        expend_mp: 120,
    };
}
