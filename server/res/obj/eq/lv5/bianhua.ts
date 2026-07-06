import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type {PropMap} from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "条";
    name = "彼岸花";
    desc = "传说中连接阴阳的彼岸花所制的项链。";
    value = 1000000;
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.NECKLACE;
    prop: PropMap = {
        gj: 280,
        mz: 280,
        diff_fy_per: 5,
        mz_per: 5,
    };
}
