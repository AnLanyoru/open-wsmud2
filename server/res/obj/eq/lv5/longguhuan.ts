import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '枚';
    name = '龙骨环';
    desc = '白色的龙骨做成的戒指，坚硬无比';
    value = 1000000;
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.RING;
    prop: PropMap = {
        gj: 278,
        mz: 198,
        bj_per: 6,
        releasetime: 1000,
    };
}
