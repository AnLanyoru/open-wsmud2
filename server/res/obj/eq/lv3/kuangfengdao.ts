import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "狂风刀";
    desc = "田伯光的武器，一柄造型短小精悍的短刀";
    value = 200000;
    grade = 3;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.BLADE;
    prop: PropMap = {
        gj: 110,
        dex: 10,
        mz: 100,
    };
}
