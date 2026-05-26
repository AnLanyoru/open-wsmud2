this.inherits(CONTAINER);
this.set({
    name: "餐桌",
    desc: "这是醉仙楼的宴席桌子，上面放满了各种好吃的。",
    unit: "个",
    value: 0,
    grade: 5,
    combined: false,
    no_get: true,
    no_alloc:true
});
this.query_items = function (me) {
    if (me.query_temp("get_dest") ) return;
    var items = [OBJ.CREATE(me.gender == 1 ? "cash/jing#4" : "food/hua", 3)];
    return items;
}
this.clear_items = function (me) {
    me.set_temp("get_dest", 1, 3600000 * 48);
}