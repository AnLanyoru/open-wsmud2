import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE; const WEAPON_TYPE = globalThis.WEAPON_TYPE;
this.inherits(EQUIPMENT);
this.set({
    unit: "把",
    name: "钢刀",
    desc: "一把精钢打造的长刀",
    value: 2500,
    eq_type: EQUIP_TYPE.WEAPON,
    weapon_type : WEAPON_TYPE.BLADE
});
this.prop = {
gj:2
};
}
