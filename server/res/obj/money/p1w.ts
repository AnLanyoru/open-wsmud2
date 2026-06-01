import { OBJ } from "../../../core/item/obj.js";
import { UTIL } from "../../../core/util/util.js";

export default class extends OBJ {
    name = "潜能";
    desc = "使用后获得一万点潜能";
    unit = "万点";
    value = 0;
    grade = 1;

    on_use(me) {
    me.add_exp(0, 10000);
}
}

