import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "山门";
    desc = "这是山门。";
    exits = {
        "north": "fb/jingnian/石阶",
        "northeast": "fb/jingnian/山路",
    };
}
