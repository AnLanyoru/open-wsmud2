import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE; const WEAPON_TYPE = globalThis.WEAPON_TYPE;
this.inherits(EQUIPMENT);
this.set({
    unit: "根",
    name: "齐眉棍",
    desc: "此棍竖直与人眉齐高，是军中常用棍",
    value: 2500,
    grade: 1,
    eq_type: EQUIP_TYPE.WEAPON,
    weapon_type: WEAPON_TYPE.CLUB
});
this.prop = {
     gj: 12,
        str: 4
};
}
