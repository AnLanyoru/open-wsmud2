import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default class extends EQUIPMENT {
    unit = "根";
    name = "铁杖";
    desc = "这是一根浑铁杖，似乎威力不大。";
    value = 2500;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.STAFF;
    prop = {
    gj: 2
};
}

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
const WEAPON_TYPE = globalThis.WEAPON_TYPE;
