import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "个";
    name = "先天太极图";
    desc = "武当至宝，先天太极";
    value = 5000000;
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.CAPE;
    prop: PropMap = {
        fy: 780,
        con: 150,
        diff_sh_per: 10,
        fy_per: 10,
        zj_per: 10,
    };
    // Special effects: 激活后10秒内无视伤害
}
