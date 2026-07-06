import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "岸边";
    desc = "这是岸边。";
    exits = {
        "east": "fb/yanzi/hc1",
    };
}
