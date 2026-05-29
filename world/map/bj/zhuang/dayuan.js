import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "大院";
    desc = "这是一个破旧的大院。院内十分宽阔，可容百人。正中一口天井,再往里是座大厅。";
    exits = {"north":"bj/zhuang/dating","south":"bj/zhuang/damen"};

    constructor() {
        super();
        this.set_npc(["bj/shenlong/dizi",2]);
    }
}
