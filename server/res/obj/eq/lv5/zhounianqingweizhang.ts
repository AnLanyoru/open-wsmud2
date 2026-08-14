import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    unit = '枚';
    name = '周年庆微章';
    desc = '武神传说周年纪念微章';
    grade = 5;
    eq_type = EQUIP_TYPE.JEWELS;
    no_jinglian = true;
}
