import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "前院";
    desc = "这是前院。";
    exits = {
        "west": "fb/taohua/大门",
        "east": "fb/taohua/大厅",
    };
}
