import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "血刀";
    desc = "血刀老祖的武器，刀身暗红，犹有血迹！";
    value = 1000000;
    grade = 5;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.BLADE;
    prop = {
        gj: 430,
        str: 65,
        mz: 400,
        add_sh_per: 5,
    };
    // Special effects: 当你攻击命中后吸取敌人鲜血强化自身
}
