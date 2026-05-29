import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "大厅";
    desc = "这是一间灵堂。堂上供了七八个牌位.看来一座灵堂上供的是一家死人.一阵阴风吹过,蜡烛突然灭了。";
    exits = {"west":"bj/zhuang/dating"};

    constructor() {
        super();
        this.set_npc("bj/shenlong/dizi");
    }
}
