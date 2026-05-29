import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "牢房";
    desc = "这是一个昏暗的房间，窗户都被钉死。地上放着皮鞭、木棍等刑具，显然这是鳌拜私立公堂，审讯人犯的所在。一个书生被捆在墙上，鲜血淋漓，遍体鳞伤。";
    exits = { "north": "bj/ao/houyuan" };

    constructor() {
        super();
        this.set_npc("bj/ao/zhuangyu");
    }
}
