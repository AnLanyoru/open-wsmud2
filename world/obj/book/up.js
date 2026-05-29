import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    unit = "份";
    name = "门派进阶残页";
    desc = "一份秘籍残页，可用来进阶门派武功，(点击技能-武功名称-查看详细-进阶)";
    value = 10000;
    grade = 4;
    transable = true;
    otype = 1;
}
