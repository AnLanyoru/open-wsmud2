import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE, WEAPON_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";

export default class extends EQUIPMENT {
    unit = "把";
    name = "屠龙刀";
    desc = "武林至尊，宝刀屠龙。号令天下，莫敢不从。倚天不出，谁与争锋！这就是武林至尊屠龙宝刀！";
    value = 1000000;
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.BLADE;
    prop: PropMap = {
        gj: 450,
        str: 65,
        con: 40,
        add_sh_per: 5,
    };
    // Special effects: 当攻击命中后有几率产生双倍伤害
}
