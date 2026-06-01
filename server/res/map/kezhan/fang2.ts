import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "地字号客房";
    desc = "这是客栈里的一间客房，房间虽然不大，但是干净整洁。这里的老板为了吸引江湖人士，专门请高人打造了这些客房，这间地字号房间的位置，方位，摆设都是有讲究的，在这里练功会大有裨益。";
    exits = { "down": "yz/kedian" };
    is_shadow = true;
    max_item_count = 1;

    on_enter(me) {
    if (check_moveout(me)) {
        me.add_status({
            id: "room",
            duration: 0,
            desc: "你在客栈地字号客房，这里的设施，方位，对练功大有好处",
            name: "地字号",
            prop: {
                study_per: 20,
                lianxi_per: 20,
                dazuo_per: 20
            }
        });
    }
}
    on_leave(me) {
    me.remove_status("room");
}
    on_heart_beat() {
    for (let item of this.items) {
        if (item.hp > 0) {
            return check_moveout(item);
        }
    }
}
}

function check_moveout(me) {
    if (!me.query_temp("kezhan")) {
        me.moveto("yz/kedian", null, me.name + "走了下来。");
        me.send_room("店小二对$N说道：这位客官，你需要付钱才可以继续住店。");
        return false;
    }
    return true;
}
