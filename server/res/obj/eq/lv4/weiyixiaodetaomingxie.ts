import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "双";
    name = "韦一笑的逃命鞋";
    desc = "明教青翼蝠王韦一笑的鞋子，不知道穿过没";
    value = 500000;
    grade = 4;
    hole_count = 3;
    eq_type = EQUIP_TYPE.SHOES;
    prop: PropMap = {
        fy: 220,
        dex: 35,
        ds: 160,
        ds_per: 1,
    };
}
