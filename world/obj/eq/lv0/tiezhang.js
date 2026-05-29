import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE; const WEAPON_TYPE = globalThis.WEAPON_TYPE;
this.inherits(EQUIPMENT);
this.set({
    unit: "根",
    name: "铁杖",
    desc: "这是一根浑铁杖，似乎威力不大。",
    value: 2500,
    eq_type: EQUIP_TYPE.WEAPON,
    weapon_type: WEAPON_TYPE.STAFF
});
this.prop = {
    gj: 2
};
}
