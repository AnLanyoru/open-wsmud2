import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "个";
    name = "杨莲亭的项圈";
    desc = "日月神教一人之下万人之上的杨莲亭的神秘项圈，不知道干什么用的";
    value = 200000;
    grade = 3;
    eq_type = EQUIP_TYPE.JEWELS;
    prop: PropMap = {
        con: 20,
        dex: 21,
        distime_per: 5,
        per: 5,
    };
}
