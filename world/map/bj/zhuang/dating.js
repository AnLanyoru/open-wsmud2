import { ROOM } from "../../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "大厅"
this.desc = "这是一间大厅。通往各个房间.东边的屋里有女子啼哭之声隐隐传来。";
this.exits={"north":"bj/zhuang/changlang","south":"bj/zhuang/dayuan","east":"bj/zhuang/dating2","west":"bj/zhuang/dating1"};

this.set_npc("bj/shenlong/dizi");
this.set_npc("bj/zhuang/zhang");
}
