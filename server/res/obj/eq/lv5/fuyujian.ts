import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    unit = '把';
    name = '覆雨剑';
    desc = '长达四尺九寸的长剑，却如破铜烂铁';
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
}
