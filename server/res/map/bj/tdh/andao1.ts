import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "暗道";
    desc = "这是一条黑漆漆的地道，曲曲折折地通向前方。两边都是土墙，隐约可以听到上面脚底落地的声音。空气中弥漫着潮湿的泥土气息，令人感到十分凉爽。一个道人站在这里，守卫着上面的两个出口。";
    exits = { "up": "bj/tdh/neishi", "west": "bj/tdh/andao" };

    constructor() {
        super();
        this.set_npc("bj/tdh/xuan");
    }
}
