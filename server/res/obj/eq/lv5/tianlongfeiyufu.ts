import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '件';
    name = '天龙飞羽服';
    desc = '天龙套装衣服，传说由飞龙的羽毛做成的，穿上后不但防御惊人，更是身轻如燕';
    value = 1000000;
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.CLOTH;
    prop: PropMap = {
        fy: 450,
        dex: 30,
        diff_sh_per: 5,
    };
    // Special effects: 减少伤害+7%
}
