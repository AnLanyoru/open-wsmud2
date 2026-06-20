import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "支";
    name = "盘龙簪";
    desc = "古朴剔透，身似龙形";
    value = 1000000;
    grade = 5;
    eq_type = EQUIP_TYPE.HEAD;
    prop: PropMap = {
        fy: 300,
        con: 150,
        int: 150,
        lianxi_per: 20,
    };
}
