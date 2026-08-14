import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '条';
    name = '学者项链';
    desc = '一条秘银打造的细长项链，佩戴后使人心神清明';
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.NECKLACE;
    prop: PropMap = {
        fy: 230,
        int: 38,
        dazuo_per: 8,
        study_per: 8,
        lianxi_per: 8,
    };
}
