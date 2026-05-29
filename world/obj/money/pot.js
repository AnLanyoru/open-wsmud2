import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    name = "潜能";
    desc = "学习或练习武功需要消耗的潜能";
    unit = "点";
    value = 0;
    grade = 1;

    on_receive(me) {
    if (!this.count) return false;
    me.add_exp(0, this.count);
}
}
