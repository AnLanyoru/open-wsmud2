import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    unit = '块';
    name = '镇抚使令';
    desc = '一块精钢所制的令牌，一面刻有代表锦衣卫的飞鱼伏蟒，一面刻着四个大字【镇抚使令】';
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.JEWELS;
}
