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
    eq_msg = '$N将$o覆在脸上，转眼便化作一名天龙寺僧人。';
    uneq_msg = '$N揭下$o，恢复了本来面目。';
}
