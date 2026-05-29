import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE; const WEAPON_TYPE = globalThis.WEAPON_TYPE;
this.inherits(EQUIPMENT);
this.unit = "把";
this.name = "铁剑";
this.desc = "一把生铁打造的剑";
this.value = 2000;
this.eq_type = EQUIP_TYPE.WEAPON;
this.weapon_type = WEAPON_TYPE.SWORD;
this.prop = {
    gj: 1
};
}
