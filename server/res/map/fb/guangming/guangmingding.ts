import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "光明顶";
    desc = "这是光明顶。";
    exits = {
        "north": "fb/guangming/qi_houtu",
        "south": "fb/guangming/xiaolu1",
    };
}
