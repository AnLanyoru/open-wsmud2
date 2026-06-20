import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "件";
    name = "龙血斗篷";
    desc = "一件黑乎乎的斗篷，据说是沾染的龙血，有些淡淡的微光，";
    value = 1000000;
    grade = 5;
    eq_type = EQUIP_TYPE.CAPE;
    prop: PropMap = {
        fy: 398,
        ds_per: 10,
        zj_per: 10,
        diff_bj: 4,
        diff_sh: 500,
    };
}
