import { ROOM } from "../../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "长廊"
this.desc = "这是条长长的走廊。四处黑沉沉的。";
this.exits={"north":"bj/zhuang/xiaowu","south":"bj/zhuang/dating"};

this.set_npc("bj/shenlong/dizi");
}
