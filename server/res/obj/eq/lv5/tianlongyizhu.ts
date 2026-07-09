import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '颗';
    name = '天龙遗珠';
    desc = '一颗颗细小的珠子组成的项链，据说是天龙的骨头磨成的，古朴晶莹';
    value = 1000000;
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.NECKLACE;
    prop: PropMap = {
        fy: 230,
        con: 78,
        mz_per: 5,
        distime: 1000,
        per: 5,
    };
}
