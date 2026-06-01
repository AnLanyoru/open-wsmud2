import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "山道";
    desc = "这是一条狭窄的山道,向着北方一座山峰行去.转过了几个山坡,抬头遥见峰顶建着几座大竹屋。";
    exits = { "south": "bj/shenlong/wuchang", "north": "bj/shenlong/damen" };
}
