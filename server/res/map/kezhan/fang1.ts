import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "人字号客房";
    desc = "这是客栈里的一间客房，房间不大，还算干净整洁，这里面很安静，你都听不到房间外面的声音。没有你的允许是没有人进来的，你在里面可以做任何事情，只要不打扰到别人。";
    exits = { "down": "yz/kedian" };
    max_item_count = 1;
    is_shadow = true;

    on_enter(me) {
    if (check_moveout(me)) {
        me.add_status({
            id: "room",
            duration: 0,
            desc: "你在客栈人字号客房，安安静静的是个练功的好地方",
            name: "人字号",
            prop: {
                study_per: 10,
                lianxi_per: 10,
                dazuo_per: 10
            }
        });
    }
}
    on_leave(me) {
    me.remove_status("room");
}
    on_heart_beat(dt: number) {
    for (let item of this.items) {
        if ('hp' in item && item.hp > 0) {
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
