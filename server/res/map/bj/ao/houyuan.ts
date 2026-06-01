import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "后院";
    desc = "这里是鳌府后院，中心是一个大花园。西边一条长廊走道直通往鳌拜的卧房，有几个官兵把守。北边是书房。南边是鳌拜私设的牢房, <cmd cmd='look men'>牢门(men)</cmd>是锁着的。";
    exits = { "west": "bj/ao/woshi", east:"bj/ao/dayuan","north":"bj/ao/shufang" };

    constructor() {
        super();
        this.set_item("men", "铁门", "这是一扇很结实的铁门。", [
            ["unlock", "打开", this.unlock_men]
        ]);
        this.set_npc("bj/ao/guanjia", ["bj/ao/jiading", 2]);
    }

    unlock_men(me) {
        if (this.query_exits("enter"))
            return me.notify("这扇门已经是打开的。");
        var obj = me.find_obj_bypath("sp/bj/laofangkey");
        if (!obj)
            return me.notify("你不会撬锁。");
        this.add_exit("south", "bj/ao/laofang");
        me.remove_obj(obj, 1);
        me.send_room("$N用一把钥匙打开了牢房门，可是钥匙却断了。");
    }
}
