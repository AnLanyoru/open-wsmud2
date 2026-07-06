import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "桂花廊";
    desc = "这是桂花廊。";
    exits = {
        "south": "fb/yihua/changlang1",
        "north": "fb/yihua/yihuage",
    };
}
