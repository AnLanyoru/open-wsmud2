import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "支";
    name = "涟星的冰玉簪";
    desc = "移花宫二宫主的冰玉簪，玲珑剔透毫无瑕疵";
    value = 200000;
    grade = 3;
    eq_type = EQUIP_TYPE.HEAD;
    prop: PropMap = {
        int: 20,
        lianxi_per: 10,
        distime: 1000,
    };
}
