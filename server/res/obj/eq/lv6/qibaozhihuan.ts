import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "枚";
    name = "七宝指环";
    desc = "逍遥至宝，七宝指环";
    value = 5000000;
    grade = 6;
    eq_type = EQUIP_TYPE.JEWELS;
    prop: PropMap = {
        gj_per: 10,
        mz_per: 10,
        bj_per: 10,
        releasetime: 2000,
        distime: 2000,
    };
    // Special effects: 每5秒恢复你5%的内力
}
