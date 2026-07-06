import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "钟楼";
    desc = "这是钟楼。";
    exits = {
        "southeast": "fb/jingnian/白石广场",
    };
}
