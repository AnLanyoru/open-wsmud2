import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '件';
    name = '飞鱼服';
    desc = '皇城守卫锦衣卫的制服';
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.CLOTH;
    prop: PropMap = {
        fy: 420,
        con: 30,
        dex: 350,
        gjsd_per: 10,
        hp_per: 10,
    };
}
