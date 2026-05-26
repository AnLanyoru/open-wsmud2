this.inherits(OBJ);
this.set({
    name: "狼皮",
    desc: "一块完整的狼皮",
    unit: "块",
    value: 10,
    grade: 1,
    combined: true
});
this.on_use = function (me) {
    me.add_status({
        id: "langpi",
        name: "伪装",
        desc: "你伪装成一只狼",
        duration: 10000
    });
    me.set_temp('langpi', 1, 10000);
    me.notify("<hic>你把一块完整的狼皮当作衣服披在身上。</hic>");
}
this.transable = true;