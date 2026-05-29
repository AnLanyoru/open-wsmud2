import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE; const WEAPON_TYPE = globalThis.WEAPON_TYPE;
this.inherits(EQUIPMENT);
this.set({
    name: "云龙剑",
    desc: "这是天地会总舵主陈近南的佩剑",
    unit: "柄",
    grade: 2,
    eq_type: EQUIP_TYPE.WEAPON,
    weapon_type: WEAPON_TYPE.SWORD,
    value: 20000,
    hole_count:1,
    prop: {
        gj: 30,
        str:5,
        mz:10
    }
});
}
