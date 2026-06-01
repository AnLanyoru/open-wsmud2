import { ROOM } from "../../../core/room/room.js";
import type { CHARACTER } from "../../../core/char/character.js";

export default class MapRoom extends ROOM {
    name = "炼药房";
    desc = "这是你帮会的炼药房，还没进入就先闻到一股浓烈的药草香味，房间里面没有多余的设施，一个大大的炼药炉摆在房子中间，可以同时供多名帮派成员使用。";
    exits = { "north": "banghui/yuanzi" };
    no_fight = true;
    can_lianyao = true;

    constructor() {
        super();
        this.add_action("lianyao", "炼药", function (this: MapRoom, me: CHARACTER) { });
    }

    on_leave(me) {

    me.remove_status("room");
}
    on_enter(me) {
    if (me.is_player) {
        let pt = me.query_party();
        if (pt) {
            var lg_level = pt.query_temp('lianyao', 0) * 1 + 1;
            me.add_status({
                id: "room",
                duration: 0,
                desc: "你在你的炼药房，炼药效率得到提升",
                name: "专心",
                prop: {
                    lianyao1: lg_level
                }
            });
        }

    }
}
}
