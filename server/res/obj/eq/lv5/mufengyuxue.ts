import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '双';
    name = '木凤羽靴';
    desc = '木凤的羽毛做的靴子，轻便耐用。';
    value = 1000000;
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.SHOES;
    group_name = 'zhanshen5';
    prop: PropMap = {
        fy: 480,
        ds: 400,
        dex: 50,
        ds_per: 10,
        diff_downside_per: 10,
    };

    group_prop(count: number): PropMap | void {
        if (count >= 4) return { gj_per: 10, mz_per: 10, zj_per: 10, ds_per: 10, fy_per: 10 };
    }
}
