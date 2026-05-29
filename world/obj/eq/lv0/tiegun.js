import { EQUIPMENT } from "../../../../os/item/equipment.js";

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

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
const WEAPON_TYPE = globalThis.WEAPON_TYPE;
