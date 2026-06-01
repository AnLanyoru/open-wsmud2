import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
    unit = "根";
    name = "铁棍";
    desc = "一根精铁打造的棍子";
    value = 2500;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.CLUB;
    prop = {
    gj: 2
};
}

