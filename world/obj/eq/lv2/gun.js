import { EQUIPMENT } from "../../../../os/item/equipment.js";

export default function() {
    const EQUIP_TYPE = globalThis.EQUIP_TYPE; const WEAPON_TYPE = globalThis.WEAPON_TYPE;
this.inherits(EQUIPMENT);
this.unit = "根";
this.name = "钓棍";
this.desc = "一根使用沉水木制作的棍子，既可以用来战斗也可以用来钓鱼";
this.value = 1000;
this.grade = 2;
this.eq_type = EQUIP_TYPE.WEAPON;
this.weapon_type = WEAPON_TYPE.CLUB;
this.prop = {
    gj: 45,
    dex: 10
};
}
