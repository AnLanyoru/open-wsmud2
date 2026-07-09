import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '双';
    name = '泰山登山靴';
    desc = '泰山派的特产，穿上后登顶泰山如履平地';
    value = 200000;
    grade = 3;
    hole_count = 2;
    eq_type = EQUIP_TYPE.SHOES;
    prop: PropMap = {
        fy: 130,
        ds: 130,
        dex: 8,
    };
}
