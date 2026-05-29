import { ROOM } from "../../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "小路"
this.desc = "你走在一条小路上。前面道路崎岖，行人很少。前方隐约有房屋可见.";
this.exits={"north":"bj/zhuang/damen","south":"bj/zhuang/xiaolu"};
this.set_npc("bj/zhuang/tufei");
}
