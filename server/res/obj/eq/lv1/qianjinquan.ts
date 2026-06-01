import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    name = "千斤拳";
    desc = "据说有千斤重，拎上去确实有几分重量，形状奇特，边缘高低不平的裂齿";
    unit = "双";
    grade = 1;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.NONE;
    value = 20000;
    prop = {
        gj: 15,
        str: 3
    };
}

