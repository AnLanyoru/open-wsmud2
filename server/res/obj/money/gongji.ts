import { OBJ } from "../../../core/item/obj.js";
import { UTIL } from "../../../core/util/util.js";

export default class extends OBJ {
    name = "门派功绩";
    desc = "你对门派的贡献，可以在门派管理那里换取各种物资";
    unit = "点";
    value = 0;
    grade = 3;

    on_receive(me) {
    if (!this.count) return false;
    me.add_temp('gongji', this.count);
    me.notify("你获得了" + UTIL.to_c(this.count) + "点<hiy>门派功绩</hiy>。");
    me.set_temp('last_sm', Date.now());
}
}

