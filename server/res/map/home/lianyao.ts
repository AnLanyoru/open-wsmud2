import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "炼药房";
    desc = "这是你的炼药房，还没进入就先闻到一股浓烈的药草香味，房间里面没有多余的设施，一个大大的炼药炉摆在房子中间。";
    exits = { "west": "home/yuanzi" };
    can_lianyao = true;

    constructor() {
        super();
        this.add_action("lianyao", "炼药");
    }

    on_leave(me) {
    if (me.master) {
        me.actions = null;
        me.master_json = null;
    }
    me.remove_status("room");
}
    on_enter(me) {
    if (me.master) {
        me.actions = [
            { cmd: "dc " + me.id + " lianyao", name: "让" + me.name + "炼药" }
        ];
        me.master_json = null;
    }

    me.add_status({
        id: "room",
        duration: 0,
        desc: "你在你的炼药房，炼药效率得到提升",
        name: "专心",
        prop: {
            lianyao1: 2
        }
    });
}
}
