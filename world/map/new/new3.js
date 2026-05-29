import { ROOM } from "../../../os/room/room.js";
import { NPC } from "../../../os/char/npc.js";

export default class extends ROOM {
    name = "训练室";
    desc = "这是一间空荡荡的训练室，所有要去闯荡江湖的人们都需要在这里学习一些基本知识，就算你是MUD老鸟，你也需要了解下在没有命令可以输入的情况下如何挖泥。";
    exits = { "north": "new/new2" };

    on_enter(me) {
    var npc = this.find_obj_bypath("new/mutouren");
    if (!npc) {
        NPC.CREATE("new/mutouren", me.environment);
    }
}
    on_leave(me, dir) {
    if (dir != "north") return me.notify_fail("你还没去交任务。");
}
}

