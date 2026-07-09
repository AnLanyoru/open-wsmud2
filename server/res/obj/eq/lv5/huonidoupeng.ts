import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '件';
    name = '火猊斗篷';
    desc = '火红的火猊皮毛所制的斗篷，防风御寒。';
    value = 1000000;
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.CAPE;
    group_name = 'zhanshen5';
    prop: PropMap = {
        fy: 458,
        zj_per: 10,
        con: 40,
        add_sh_per: 5,
        diff_sh: 1000,
    };

    group_prop(count: number): PropMap | void {
        if (count >= 4) return { gj_per: 10, mz_per: 10, zj_per: 10, ds_per: 10, fy_per: 10 };
    }
}
