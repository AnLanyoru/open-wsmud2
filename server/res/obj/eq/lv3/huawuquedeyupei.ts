import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "个";
    name = "花无缺的玉佩";
    desc = "花无缺随身携带的玉佩，佩戴上潇洒异常";
    value = 200000;
    grade = 3;
    eq_type = EQUIP_TYPE.JEWELS;
    prop: PropMap = {
        con: 30,
        lianxi_per: 15,
        diff_busy: 2000,
    };
}
