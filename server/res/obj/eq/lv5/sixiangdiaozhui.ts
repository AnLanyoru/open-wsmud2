import { EQUIPMENT } from '../../../../core/item/equipment.js';
import { EQUIP_TYPE } from '../../../../core/const.js';

export default class extends EQUIPMENT {
    unit = '串';
    name = '四象吊坠';
    desc = '一串项链，据说其中封印了四神兽的精魄，时有凤鸣龙吟';
    grade = 5;
    hole_count = 4;
    eq_type = EQUIP_TYPE.NECKLACE;
}
