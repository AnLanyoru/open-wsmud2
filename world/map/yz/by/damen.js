import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "兵营大门";
    desc = "你正站在兵营的门口，面对着一排简陋的营房，可以看到穿着制服的官兵正在操练，不时地传来呐喊声。老百姓是不允许在此观看的，你最好赶快走开。";
    exits = { "south": "yz/by/bingying"};

    constructor() {
        super();
        this.set_npc( ["pub/bing", 2]);
    }

    on_leave(me, dir) {
    if (dir === "south" && this.find_obj_bypath("pub/bing")) {
        me.notify("官兵拦住了你的去路。");
        return false;
    }
}
}
