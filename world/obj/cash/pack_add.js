this.inherits(OBJ);
this.set({
    unit: "颗",
    name: "背包扩充石",
    desc: "使用后增加你的背包容量+10",
    grade: 1,
    value: 0
});
this.on_use = function (me) {
    var size = 10;
    if (me.max_item_count + size > 100) return me.notify_fail("背包最多只能扩充到100格。");
    me.max_item_count += size;
    me.send('{"type":"dialog","dialog":"pack",max_item_count:' + me.max_item_count + '}');
    // me.notify('你的背包容量扩充为' + me.max_item_count + "。");
    return true;
}