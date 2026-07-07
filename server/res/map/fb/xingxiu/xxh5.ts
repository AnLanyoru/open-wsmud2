import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "星宿海";
    exits = {
        "north": "fb/xingxiu/xxh3",
        "southwest": "fb/xingxiu/xxh6",
    };
}
