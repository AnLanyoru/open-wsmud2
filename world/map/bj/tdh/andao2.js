import { ROOM } from "../../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "暗道";
this.desc = "终于走出了暗道，你长长的舒了一口气。北边是天地会青木堂的大厅，明亮的灯光让人感到无比温暖。";

this.exits = { "east": "bj/tdh/andao", "north": "bj/tdh/dating" };
this.set_npc("bj/tdh/wu");
}
