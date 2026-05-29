import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.unit = "颗";
this.name = "初级毁容丸";
this.value = 280000;
this.desc = "这是一颗神奇的丹药，食用后会使你的容貌产生一些神奇的变化";
this.grade = 3;
this.transable = true;
this.on_use = function (me) {
    if (me.per <= 20) return me.notify_fail("初级毁容丸已经对你没有任何效果了。");
    me.per -= 1;
    me.notify("<hib>你吞下一颗初级毁容丸，感觉自己的容貌发生了一些变化。</hib>");
}
}
