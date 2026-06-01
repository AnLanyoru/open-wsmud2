import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "练功房";
    desc = "这是你的帮派的练功房，房间的北面各种武器玲琅满目，刀枪剑棍，十八般兵器在这里都能找到，四周石墙的青砖已经被刻满剑痕刀伤，看来经常有人在这里练功。";
    exits = { "south": "banghui/yuanzi" };
    no_fight = true;

    constructor() {
        super();
        this.add_action("fenpei", "分配属性", null);
        this.add_action("xiulian", "修炼", null);
    }

    on_leave(me) {
   
    me.remove_status("room");
}
    on_enter(me) {
    if (me.is_player) {
        let pt = me.query_party();
        if (pt) {
            var lg_level = pt.query_temp('liangong', 0) * 10 + 10;
            me.add_status({
                id: "room",
                duration: 0,
                desc: "你在练功房，心无旁骛，修炼效率得到提高",
                name: "静心",
                prop: {
                    study_per: lg_level,
                    lianxi_per: lg_level,
                    dazuo_per: lg_level
                }
            });
        }
    }
}
}
