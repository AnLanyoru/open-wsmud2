import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    unit = "颗";
    name = "初级美容丸";
    value = 280000;
    desc = "这是一颗药王谷出品的美容药丸，可以增加你的先天容貌，不超过25";
    grade = 3;
    transable = true;

    on_use(me) {
    if (me.per >= 25) return me.notify_fail("初级美容丸已经对你没有任何效果了。");
    me.per += 1;
    me.notify("<him>你吞下一颗初级美容丸，感觉自己又漂亮了一些。</him>");
}
}
