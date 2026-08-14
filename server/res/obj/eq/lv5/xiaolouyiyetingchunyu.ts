import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '把';
    name = '小楼一夜听春雨';
    desc = '这是青青的弯刀，刀锋也是青青的，上面刻着七个字：小楼一夜听春雨';
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.BLADE;
    prop: PropMap = {
        gj: 570,
        str: 50,
        releasetime_per: 8,
        gjsd_per: 8,
        expend_mp_per: 8,
    };
}
