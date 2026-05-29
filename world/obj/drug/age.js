import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.unit = "颗";
this.name = "驻颜丹";
this.value = 1280000;
this.desc = "这是一颗女士梦寐以求的驻颜神丹，食用后会使你年轻一岁";
this.grade = 4;
this.on_use = function (me) {
    if (me.query_age() < 20) return me.notify_fail("年纪轻轻的用什么驻颜丹。");
    me.add_temp('age', 1);
    me.notify("<him>你吞下一颗驻颜丹，感觉自己又年轻了一些。</him>");
}
this.transable = true;
}
