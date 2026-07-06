import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "南天门";
    desc = "这是南天门。";
    exits = {
        "northwest": "fb/hengshan2/山路",
    };
}
