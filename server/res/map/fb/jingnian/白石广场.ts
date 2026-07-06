import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "白石广场";
    desc = "这是白石广场。";
    exits = {
        "northwest": "fb/jingnian/钟楼",
        "east": "fb/jingnian/后山",
    };
}
