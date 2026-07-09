import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '枚';
    name = '阴阳环';
    desc = '一枚未知材质的指环，半黑半白，阴阳互衔。';
    value = 1000000;
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.RING;
    prop: PropMap = {
        gj: 280,
        hp_per: 5,
        diff_fy_per: 5,
        diff_sh_per: 5,
    };
}
