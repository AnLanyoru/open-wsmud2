import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '个';
    name = '昊天靴';
    desc = '华山至宝，追风踏月';
    value = 5000000;
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.SHOES;
    prop: PropMap = {
        fy: 380,
        str: 100,
        dex: 100,
        diff_busy_per: 20,
        ds_per: 10,
    };
    // Special effects: 激活后清除自身忙乱状态，在10秒内免疫控制
}
