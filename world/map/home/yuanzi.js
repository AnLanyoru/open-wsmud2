import { ROOM } from "../../../os/room/room.js";
import { FOLLOWER } from "../../../os/char/follower.js";

export default class extends ROOM {
    name = "院子";
    desc = "这是你家的大院，迎面是一个假山水池，池上摆着一块奇形怪状的石头，据说是之前人家留下来的，水池两旁种满了花草，东边是一颗槐树，郁郁葱葱，遮盖了大半个院子，背面是你的卧室，西面是练功房";
    exits = { "out": "yz/home", "west": "home/liangong", north: "home/woshi", "east": "home/lianyao", "northeast": "home/huayuan" };

    on_enter(me) {
    if (me.follower && this.owner === me.id) {
        for (var i = 0; i < me.follower.length; i++) {
            FOLLOWER.CREATE(me, me.follower[i], this.on_npc_create.bind(this, me));
        }
    }
    if (me.master) {
        me.actions = [
            { cmd: "dismiss " + me.id, name: "遣散" + me.name }
        ];
        me.master_json = null;
    }
}
    on_npc_create(me, npc) {
    if (!npc) return;
    if (npc.environment && npc.environment.parent.id == "home") return;
    if (!npc.hp) npc.hp = 1;
    if (npc.state) npc.set_state(null);
    npc.moveto(this, npc.name + "离开了。", npc.name + "走了过来。");
    npc.on_master_enter && npc.on_master_enter(me);
}
    on_leave(me) {
    if (me.master) {
        me.actions = null;
        me.master_json = null;
    }
}
}

