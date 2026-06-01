import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "长廊";
    desc = "这是条长长的走廊。四处黑沉沉的。";
    exits = {"north":"bj/zhuang/xiaowu","south":"bj/zhuang/dating"};

    constructor() {
        super();
        this.set_npc("bj/shenlong/dizi");
    }
}
