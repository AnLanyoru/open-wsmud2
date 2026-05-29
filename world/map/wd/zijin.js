import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "紫金城"
this.desc = "在你的面前是一座道观，上面写着“紫金城”三个朱红色的大字，红砖碧瓦，院墙上是一人般大小的“无量寿佛”四个大字。院中房间延绵百余间，身穿不同服色的道士确不断进进出出，诵经的声音隐隐传来。再往北是一条竹林小道。";
this.exits = { "south": "wd/santian", "north": "wd/xiaolu" };
}
