import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '枚';
    name = '崔员外的戒指';
    desc = '一枚金子打造的戒指,有点粗';
    value = 10000;
    eq_type = EQUIP_TYPE.RING;
    grade = 1;
    prop: PropMap = {
        gj: 2,
        mz: 2,
    };
}
