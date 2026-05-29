import { EQUIPMENT } from "../../../../os/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../os/const.js";

export default class extends EQUIPMENT {
    unit = "根";
    name = "木棍";
    desc = "一把木头削成的棍子，看上去唬人，但没什么杀伤力";
    value = 1000;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.CLUB;
    prop = {
    gj: 1
};
}

