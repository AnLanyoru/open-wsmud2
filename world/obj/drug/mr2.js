this.inherits(OBJ);
this.unit = "颗";
this.name = "初级美容丸";
this.value = 280000;
this.desc = "这是一颗药王谷出品的美容药丸，可以增加你的先天容貌，不超过25";
this.grade = 3;
this.transable = true;
this.on_use = function (me) {
    if (me.per >= 25) return me.notify_fail("初级美容丸已经对你没有任何效果了。");
    me.per += 1;
    me.notify("<him>你吞下一颗初级美容丸，感觉自己又漂亮了一些。</him>");
}