import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '根';
    name = '灵蛇杖';
    desc = '这是白驼山的灵蛇杖，一条毒蛇环绕其上，仿若活物';
    value = 500000;
    grade = 4;
    hole_count = 3;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.STAFF;
    prop: PropMap = {
        gj: 260,
        str: 32,
        zj: 210,
        mz: 192,
    };
}
