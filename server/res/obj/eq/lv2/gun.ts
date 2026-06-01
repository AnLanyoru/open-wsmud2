import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "根";
    name = "钓棍";
    desc = "一根使用沉水木制作的棍子，既可以用来战斗也可以用来钓鱼";
    value = 1000;
    grade = 2;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.CLUB;
    prop = {
    gj: 45,
    dex: 10
};
}

