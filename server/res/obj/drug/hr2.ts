import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "颗";
    name = "初级毁容丸";
    value = 280000;
    desc = "这是一颗神奇的丹药，食用后会使你的容貌产生一些神奇的变化";
    grade = 3;
    transable = true;

    on_use(me) {
    if (me.per <= 20) return me.notify_fail("初级毁容丸已经对你没有任何效果了。");
    me.per -= 1;
    me.notify("<hib>你吞下一颗初级毁容丸，感觉自己的容貌发生了一些变化。</hib>");
}
}
