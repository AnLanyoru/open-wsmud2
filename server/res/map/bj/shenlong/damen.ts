import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "大门";
    desc = "这是间很大的竹屋。门外站着几个年轻弟子.再住北就是神龙教大厅, 隔得虽远, 却也可以听得到厅上众人齐声念颂之声。";
    exits = { "south": "bj/shenlong/dadao2", "north": "bj/shenlong/dating" };

    constructor() {
        super();
        this.set_npc(["bj/shenlong/dizi", 2]);
    }

    on_leave(me, dir) {
    if (dir == "north") {
        var obj = this.find_obj_bypath("bj/shenlong/dizi");
        if (obj) {
            me.notify("神龙教弟子挡住了你：神龙教重地，外人不得入内。");
            return false;
        }
    }
}
}
