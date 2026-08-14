import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    unit = '条';
    name = '学者项链';
    desc = '一条秘银打造的细长项链，佩戴后使人心神清明';
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.NECKLACE;
}
