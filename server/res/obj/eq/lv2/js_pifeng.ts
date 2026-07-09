import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    name = '金蛇披风';
    desc = '一件暗金色的披风，';
    unit = '件';
    grade = 2;
    hole_count = 1;
    eq_type = EQUIP_TYPE.CAPE;
    value = 20000;
    prop: PropMap = {
        fy: 35,
        max_hp: 300,
    };
}
