import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    unit = '件';
    name = '粉红绸衫';
    desc = '写作绸衫，实际上还是粗布衣';
    value = 1000;
    grade = 0;
    eq_type = EQUIP_TYPE.CLOTH;
}
