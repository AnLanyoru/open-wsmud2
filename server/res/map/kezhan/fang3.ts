import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "天字号客房";
    desc = "这是客栈里面最好的客房，房间里面空间很大，门口竖有张屏风，看上去很贵重的样子，据说这里面的布置，物件都是客栈老板花大价钱买来的天材地宝，在这里练功对你大有益处。";
    exits = { "down": "yz/kedian" };
    is_shadow = true;
    max_item_count = 1;

    on_enter(me) {
    if (check_moveout(me)) {
        me.add_status({
            id: "room",
            duration: 0,
            desc: "你在客栈天字号房间，这里一堆天才地宝，简直就是练功圣地",
            name: "天字号",
            prop: {
                study_per: 50,
                lianxi_per: 50,
                dazuo_per: 50
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
