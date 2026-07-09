import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    unit = '个';
    name = '阿朱的易容面具';
    desc = '慕容家的丫鬟阿朱用来易容的面具';
    value = 500000;
    grade = 4;
    hole_count = 3;
    eq_type = EQUIP_TYPE.HEAD;
    // Special effects: 使用后你可以易容成当前房间的某一个人
}
