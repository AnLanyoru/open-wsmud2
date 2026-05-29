import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "暗道";
    desc = "终于走出了暗道，你长长的舒了一口气。北边是天地会青木堂的大厅，明亮的灯光让人感到无比温暖。";
    exits = { "east": "bj/tdh/andao", "north": "bj/tdh/dating" };

    constructor() {
        super();
        this.set_npc("bj/tdh/wu");
    }
}
