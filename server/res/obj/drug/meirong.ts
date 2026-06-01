import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "颗";
    name = "美容丸";
    value = 1280000;
    desc = "这是一颗女士梦寐以求的美容神丹，食用后会使你更加漂亮";
    grade = 5;
    transable = true;

    on_use(me) {
    if (me.per < 25) return me.notify_fail("你的底子太差，还是先用初级美容丸提升一下吧。");
    if (me.per > 41) return me.notify_fail("你已经很漂亮了。");
    me.per += 1;
    me.notify("<him>你吞下一颗美容丸，感觉自己又漂亮了一些。</him>");
}
}
