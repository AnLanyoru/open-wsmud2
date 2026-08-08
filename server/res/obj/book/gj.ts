import { OBJ } from '../../../core/item/obj.js';

/** 知识类技能武道材料。 */
export default class extends OBJ {
    unit = '份';
    name = '古籍残卷';
    desc = '一份记载着古老知识的残卷，可用于知识类技能的武道进阶。';
    value = 10000;
    grade = 5;
    transable = true;
    otype = 1;
}
