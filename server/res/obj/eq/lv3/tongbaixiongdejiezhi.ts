import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "枚";
    name = "童百熊的戒指";
    desc = "风雷堂童百熊的戒指，做工粗犷，材质精良";
    value = 200000;
    grade = 3;
    eq_type = EQUIP_TYPE.RING;
    prop: PropMap = {
        gj: 98,
        bj_per: 2,
        mz: 80,
    };
}
