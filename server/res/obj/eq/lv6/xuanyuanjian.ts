import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "轩辕剑";
    desc = "传说中的神器，由众神采首山之铜为黄帝所铸，以此击杀蚩尤，剑身一面刻日月星辰，一面刻山川草木。";
    value = 5000000;
    grade = 6;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
    prop: PropMap = {
        gj: 780,
        str: 150,
        mz_per: 20,
        add_sh_per: 12,
        diff_fy_per: 12,
    };
    // Special effects: 命中后增加你的全部战斗属性10%，可叠加10层
}
