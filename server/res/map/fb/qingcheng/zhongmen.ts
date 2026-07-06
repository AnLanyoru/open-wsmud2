import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "穿廊门";
    desc = "这是穿廊门。";
    exits = {
        "south": "fb/qingcheng/songfeng",
    };
}
