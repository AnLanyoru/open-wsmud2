import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "个";
    name = "金顶佛光";
    desc = "峨眉至宝，佛光护身";
    value = 5000000;
    grade = 6;
    eq_type = EQUIP_TYPE.JEWELS;
    prop: PropMap = {
        fy: 600,
        con: 150,
        distime_per: 20,
        releasetime_per: 20,
        diff_sh_per: 10,
    };
    // Special effects: 每5秒恢复你5%的气血
}
