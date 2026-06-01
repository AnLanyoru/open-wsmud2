import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    name = "经验";
    desc = "你获得的经验，潜能";
    unit = "点";
    value = 0;
    grade = 1;

    on_receive(me) {
    if (!this.count) return false;
    me.add_exp(this.count, this.count);
}
}
