import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "大门";
    desc = "这是大门。";
    exits = {
        "west": "fb/taohua/试剑亭",
        "east": "fb/taohua/前院",
    };
}
