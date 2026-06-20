import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "颗";
    name = "女娲石";
    desc = "传说中女娲补天遗留下来的一块五彩神石";
    value = 5000000;
    grade = 6;
    eq_type = EQUIP_TYPE.JEWELS;
    prop = {
        lianxi_per: 40,
        dazuo_per: 40,
        hp_per: 20,
        con: 200,
    };
    // Special effects: 死亡后立即复活，冷却时间60分钟
}
