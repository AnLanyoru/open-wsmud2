import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "海边岩石";
    desc = "这是海边岩石。";
    exits = {
        "west": "fb/binghuo/yslu1",
        "north": "fb/binghuo/conglin1",
    };
}
