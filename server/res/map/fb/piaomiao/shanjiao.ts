import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "山脚";
    desc = "这是山脚。";
    exits = {
        "north": "fb/piaomiao/ya",
    };
}
