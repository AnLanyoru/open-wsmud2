import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '把';
    name = '闯王宝刀';
    desc = '这是闯王所使用过的刀，上面刻有几行小字。';
    value = 200000;
    grade = 3;
    hole_count = 2;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.BLADE;
    prop: PropMap = {
        gj: 130,
        str: 10,
        con: 10,
    };
}
