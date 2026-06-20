import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "枚";
    name = "东方不败的绣花针";
    desc = "只是一根简单的绣花针，却使人感到剑气森森，不寒而栗";
    value = 500000;
    grade = 4;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
    prop = {
        gj: 250,
        gjsd_per: 20,
        bj_per: 5,
        diff_fy_per: 10,
    };
    // Special effects: 辟邪剑法+100级 葵花神功+100级
}
