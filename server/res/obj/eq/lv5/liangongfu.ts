import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '件';
    name = '练功服';
    desc = '古宗门弟子练功所穿的衣服';
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.CLOTH;
    prop: PropMap = {
        fy: 420,
        int: 55,
        dazuo_per: 8,
        study_per: 8,
        lianxi_per: 8,
    };
}
