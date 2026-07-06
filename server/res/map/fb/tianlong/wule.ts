import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "无乐阁";
    desc = "这是无乐阁。";
    exits = {
        "northwest": "fb/tianlong/ta",
        "south": "fb/tianlong/wujing",
    };
}
