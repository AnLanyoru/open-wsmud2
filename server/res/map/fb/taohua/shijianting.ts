import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "试剑亭";
    exits = {
        "north": "fb/taohua/xiaolu",
        "east": "fb/taohua/damen",
    };
}
