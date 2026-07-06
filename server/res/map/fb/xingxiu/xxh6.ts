import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "星宿海";
    desc = "这是星宿海。";
    exits = {
        "northeast": "fb/xingxiu/xxh5",
        "northwest": "fb/xingxiu/xxh4",
    };
}
