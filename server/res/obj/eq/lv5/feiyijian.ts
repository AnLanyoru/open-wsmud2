import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE, WEAPON_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '把';
    name = '飞翼剑';
    desc = '身无彩凤双飞翼，心有灵犀一点通。';
    value = 1000000;
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.WEAPON;
    weapon_type = WEAPON_TYPE.SWORD;
    prop: PropMap = {
        gj: 489,
        int: 60,
        lianxi_per: 15,
    };
}
