import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    unit = "颗";
    name = "毁容丸";
    value = 1280000;
    desc = "这是一颗神奇的丹药，食用后会使你的容貌产生一些神奇的变化";
    grade = 4;
    transable = true;

    on_use(me) {
    if (me.per < 2) return me.notify_fail("你已经没有办法继续折腾你的容貌了。");
    me.per -= 1;
    me.notify("<hib>你吞下一颗毁容丸，感觉自己的容貌发生了一些变化。</hib>");
}
}
