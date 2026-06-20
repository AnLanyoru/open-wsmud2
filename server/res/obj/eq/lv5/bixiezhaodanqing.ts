import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "碧血照丹青";
    desc = "剑长一尺七寸的墨绿色短剑，骤看似乎没有什么光泽，但若多看两眼，便会觉得剑气森森，逼人眉睫，连眼睛都难睁开。";
    value = 1000000;
    grade = 5;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
    prop: PropMap = {
        gj: 480,
        mz: 150,
        mz_per: 10,
        diff_fy_per: 10,
    };
    // Special effects: 明玉功+100级
}
