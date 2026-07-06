import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "石阶";
    desc = "这是石阶。";
    exits = {
        "south": "fb/jingnian/山门",
        "north": "fb/jingnian/殿门",
    };
}
