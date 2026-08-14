import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '顶';
    name = '金狴骨冠';
    desc = '似乎是金狴的头骨所制，看上去有些吓人';
    value = 1000000;
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.HEAD;
    group_name = 'zhanshen5';
    prop: PropMap = {
        fy: 420,
        int: 50,
        distime_per: 10,
        expend_mp_per: 10,
        bj_per: 8,
    };

    group_prop(count: number): PropMap | void {
        if (count >= 4) return { gj_per: 10, mz_per: 10, zj_per: 10, ds_per: 10, fy_per: 10 };
    }
}
