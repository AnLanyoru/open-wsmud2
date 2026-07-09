import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    name = '神龙腰带';
    desc = '神龙教管理层的制服腰带';
    unit = '条';
    grade = 2;
    hole_count = 1;
    eq_type = EQUIP_TYPE.WAIST;
    prop: PropMap = {
        fy: 18,
        dazuo_per: 10,
    };
}
