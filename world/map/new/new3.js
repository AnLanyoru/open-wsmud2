import { ROOM } from "../../../os/room/room.js";

export default function() {
    const NPC = globalThis.NPC;
this.inherits(ROOM);
this.name = "训练室"
this.desc = "这是一间空荡荡的训练室，所有要去闯荡江湖的人们都需要在这里学习一些基本知识，就算你是MUD老鸟，你也需要了解下在没有命令可以输入的情况下如何挖泥。";
this.exits = { "north": "new/new2" };
this.on_enter = function (me) {
    var npc = this.find_obj_bypath("new/mutouren");
    if (!npc) {
        NPC.CREATE("new/mutouren", me.environment);
    }
}
this.on_leave = function (me, dir) {
    if (dir != "north") return me.notify_fail("你还没去交任务。");
}
}
