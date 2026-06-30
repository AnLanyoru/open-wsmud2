import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "枚";
    name = "悟道之戒";
    desc = "一枚蕴含天地灵气的戒指，佩戴后可大幅提升悟性与打坐效率。";
    value = 0;
    grade = 6;
    eq_type = EQUIP_TYPE.RING;
    prop: PropMap = {
        int: 100000,
        dazuo_per: 1000000,
    };
}
