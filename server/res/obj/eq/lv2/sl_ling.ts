import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    name = '神龙令';
    desc = '神龙教的令牌，持有者如教主亲临';
    unit = '块';
    grade = 2;
    hole_count = 1;
    eq_type = EQUIP_TYPE.JEWELS;
    value = 30000;
    prop: PropMap = {
        int: 10,
        expend_mp_per: 10,
    };
}
