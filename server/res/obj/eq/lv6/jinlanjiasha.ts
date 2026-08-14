import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '件';
    name = '锦斓袈裟';
    desc = '少林至宝上嵌七宝，水火不侵，可以防身趋祟。';
    value = 5000000;
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.CLOTH;
    prop: PropMap = {
        fy: 650,
        int: 200,
        diff_sh: 10000,
        fy_per: 15,
        hp_per: 15,
        ig_bj: 1,
        desc: '免疫暴击',
    };
}
