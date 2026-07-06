import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "星宿海";
    desc = "这是星宿海。";
    exits = {
        "north": "fb/xingxiu/xxh2",
        "southeast": "fb/xingxiu/xxh6",
    };
}
