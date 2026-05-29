import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "小路";
    desc = "你走在一条小路上。前面道路崎岖，行人很少。前方隐约有房屋可见.";
    exits = {"north":"bj/zhuang/damen","south":"bj/zhuang/xiaolu"};

    constructor() {
        super();
        this.set_npc("bj/zhuang/tufei");
    }
}
