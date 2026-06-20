import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "火龙刀";
    desc = "这是一把在火龙王附近找到的宝刀，因为长期在充满火焰的地方，所以它本身也带了一些火毒";
    value = 200000;
    grade = 3;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.BLADE;
    prop: PropMap = {
        gj: 110,
        str: 10,
        zj: 10,
    };
    // Special effects: 当你命中敌人后会使敌方受到火毒伤害
}
