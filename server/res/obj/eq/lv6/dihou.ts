import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '把';
    name = '地候';
    desc = '一人多高的大斧，似如破铜烂铁，但阵阵杀意却直冲脑海';
    grade = 6;
    hole_count = 5;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.STAFF;
    prop: PropMap = {
        desc: '碎骨：暴击后附加敌人2%气血的伤害（词条尚未开放）',
    };
}
