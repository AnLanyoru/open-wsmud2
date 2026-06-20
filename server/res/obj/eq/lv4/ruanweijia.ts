import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "件";
    name = "软猬甲";
    desc = "是黄药师送给妻子冯氏的定情之物";
    value = 500000;
    grade = 4;
    eq_type = EQUIP_TYPE.CLOTH;
    prop: PropMap = {
        fy: 250,
        dex: 22,
        diff_sh_per: 8,
    };
    // Special effects: 当你受到攻击后会反弹一部分伤害，冷却3秒
}
