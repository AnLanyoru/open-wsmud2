import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';
import type { PropMap } from '../../../../types/props.js';

export default class extends EQUIPMENT {
    unit = '串';
    name = '四象吊坠';
    desc = '一串项链，据说其中封印了四神兽的精魄，时有凤鸣龙吟';
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.NECKLACE;
    prop: PropMap = {
        per: 5,
        gj_per: 5,
        fy_per: 5,
        mz_per: 5,
        zj_per: 5,
    };
}
