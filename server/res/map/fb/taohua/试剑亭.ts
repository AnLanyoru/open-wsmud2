import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "试剑亭";
    desc = "这是试剑亭。";
    exits = {
        "north": "fb/taohua/小路",
        "east": "fb/taohua/大门",
    };
}
