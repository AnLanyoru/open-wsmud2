import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "无净阁";
    exits = {
        "north": "fb/tianlong/wule",
        "west": "fb/tianlong/banruo",
    };
}
