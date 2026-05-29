import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE; const WEAPON_TYPE = globalThis.WEAPON_TYPE;
this.inherits(EQUIPMENT);
this.set({
    name: "流氓短剑",
    desc: "这是城外流氓们配备的防身武器，一把短剑，可以当匕首用",
    unit: "把",
    grade: 1,
    eq_type: EQUIP_TYPE.WEAPON,
    weapon_type: WEAPON_TYPE.SWORD,
    prop: {
        gj: 10,
        dex: 2
    }
});
}
