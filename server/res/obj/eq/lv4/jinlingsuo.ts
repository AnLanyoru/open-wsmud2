import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '把';
    name = '金铃索';
    desc = '这是一条白色的绸带，绸带末端系着一个金色的小球';
    value = 500000;
    grade = 4;
    hole_count = 3;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.WHIP;
    prop: PropMap = {
        gj: 230,
        busy_per: 10,
        diff_fy_per: 8,
        mz: 130,
    };
}
