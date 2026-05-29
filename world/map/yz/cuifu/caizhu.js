import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "大门";
    desc = "一座富丽堂皇的大宅院出现在你的眼前，两头高大的石狮子镇住了大门两侧，朱漆大门足足有三寸厚。门上挂着两个灯笼，写着“崔”字。崔家是当地首富，而且以蛮横著称。几条狼狗嚎叫着向你冲了过来。";
    exits = { "north": "yz/cuifu/dayuan" };

    constructor() {
        super();
        this.set_npc([
            "yz/cuifu/langgou", 2
        ]);
    }

    on_enter(me) {
    if (me.is("yz/cuifu/yahuan")) {
        var player = me.follow_target;
        if (!player || !player.is_here(me)) return;
        if ( player.can_follow("yz/cuifu/yahuan")) {
            me.do_follow(null);
            player.notify("眼看就要走到门外，丫鬟却站在原地不动了。");
            player.notify("丫鬟垂首说道：这位大人，小女子已无家可归，还望大人收留！");
            player.send_commands("ok " + me.id, "答应她");
        } else {
            player.notify("走到这里，丫鬟对你说道：谢谢这位" + player.call() + "。");
            me.do_follow(null);
            player.notify("丫鬟想了想又对你说道：这位" + player.call() + "，崔员外家的东厢好像还藏了些东西，你可以去找找看。");
            player.notify("丫鬟急匆匆的走了。");
            me.destroy();
        }
        player.set_temp("fb/cuifu/yahuan", 2);
        player.add_fbscore(20);

    }
}
}
