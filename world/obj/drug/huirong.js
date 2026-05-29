import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.unit = "颗";
this.name = "毁容丸";
this.value = 1280000;
this.desc = "这是一颗神奇的丹药，食用后会使你的容貌产生一些神奇的变化";
this.grade = 4;
this.transable = true;
this.on_use = function (me) {
    if (me.per < 2) return me.notify_fail("你已经没有办法继续折腾你的容貌了。");
    me.per -= 1;
    me.notify("<hib>你吞下一颗毁容丸，感觉自己的容貌发生了一些变化。</hib>");
}
}
