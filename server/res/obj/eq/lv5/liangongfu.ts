import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    unit = '件';
    name = '练功服';
    desc = '古宗门弟子练功所穿的衣服';
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.CLOTH;
}
