import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '个';
    name = '田伯光的面罩';
    desc = '田伯光作案时候戴的头套';
    value = 200000;
    grade = 3;
    hole_count = 2;
    eq_type = EQUIP_TYPE.HEAD;
    prop: PropMap = {
        ds: 100,
        dex: 10,
        diff_busy: 1000,
    };
}
