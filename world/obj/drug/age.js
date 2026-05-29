import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    unit = "颗";
    name = "驻颜丹";
    value = 1280000;
    desc = "这是一颗女士梦寐以求的驻颜神丹，食用后会使你年轻一岁";
    grade = 4;
    transable = true;

    on_use(me) {
    if (me.query_age() < 20) return me.notify_fail("年纪轻轻的用什么驻颜丹。");
    me.add_temp('age', 1);
    me.notify("<him>你吞下一颗驻颜丹，感觉自己又年轻了一些。</him>");
}
}
