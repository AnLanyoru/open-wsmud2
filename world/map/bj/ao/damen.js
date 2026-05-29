import { ROOM } from "../../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "大门"
this.desc = "一座富丽堂皇的大宅院出现在你的眼前，两头高大的石狮子镇住了大门两侧。门额上悬挂一方横匾，写着‘满洲第一勇士鳌拜府’几个大字，门外有官兵把守，戒备森严。门上挂着两个灯笼，赫然写着“鳌”字。";
this.exits = { "west": "bj/ao/dayuan" };
this.on_leave = function (me, dir) {
    if (dir == "west" && this.find_by_path("pub/bing")) {
        return me.notify_fail("官兵拦住你骂道：“你以为你是谁啊？一个寻常百姓，难道还想进府见鳌大人？！你这" + me.call(true) + "快给我滚远点儿，不然别怪我不客气！");
    }
}
this.set_npc(["pub/bing",2]);
}
