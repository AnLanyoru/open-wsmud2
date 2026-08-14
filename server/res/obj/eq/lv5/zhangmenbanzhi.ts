import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '枚';
    name = '掌门扳指';
    desc = '古代宗门掌门的身份标志';
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.RING;
    prop: PropMap = {
        gj: 400,
        int: 45,
        study_per: 8,
        lianxi_per: 8,
        dazuo_per: 8,
    };
}
