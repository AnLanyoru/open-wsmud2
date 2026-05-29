import { CONTAINER } from "../../../os/item/container.js";

export default function() {
    const WORLD = globalThis.WORLD; const OBJ = globalThis.OBJ;
this.inherits(CONTAINER);
this.set({
    name: "婚宴礼桌",
    desc: "这是醉仙楼的宴席桌子，上面放满了各种好吃的。",
    unit: "个",
    value: 0,
    grade: 1,
    combined: false,
    no_get: true,
    no_alloc: true
});
this.on_create = function (path, par) {
    var lv = 0;
    if (par) {
        lv = parseInt(par.substr(1));
        if (!(lv > 0 && lv < 6)) lv = 0;
    }
    this.grade = lv;
}
this.query_items = function (me) {
    if (me.query_temp("get_marry") || !WORLD.DATA.query_temp("marry")) return;
    var items = [];
    var count = 1;
    if (me.id == WORLD.DATA.query_temp("mar1") || me.id == WORLD.DATA.query_temp("mar2")) count = 3;
    for (var i = 0; i < this.grade; i++) {
        var obj = OBJ.CREATE("food/marry#" + (this.random(3) + 3 * i), count);
        items.push(obj);
    }
    return items;
}
this.clear_items = function (me) {
    me.set_temp("get_marry", 1, 60000 * 30);
}
}
