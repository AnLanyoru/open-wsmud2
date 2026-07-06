import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "太室阙";
    desc = "这是太室阙。";
    exits = {
        "north": "fb/songshan/tianzhongge",
    };
}
