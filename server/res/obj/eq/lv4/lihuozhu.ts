import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '颗';
    name = '离火珠';
    desc =
        '这是一颗在火山里面找到神奇珠子，通体发红，却又带有一丝丝凉意，带在身上使人神清气爽，精气十足';
    value = 500000;
    grade = 4;
    hole_count = 3;
    eq_type = EQUIP_TYPE.JEWELS;
    prop: PropMap = {
        gj: 100,
        str: 20,
        mz: 79,
        dex: 20,
    };
}
