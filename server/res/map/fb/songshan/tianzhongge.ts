import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "天中阁";
    desc = "这是天中阁。";
    exits = {
        "south": "fb/songshan/taishi",
        "north": "fb/songshan/dadian",
    };
}
