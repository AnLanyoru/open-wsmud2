import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    unit = '支';
    name = '小师妹的冰玉簪';
    desc = '一根来历神秘的玉簪，玲珑剔透毫无瑕疵';
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.HEAD;
}
