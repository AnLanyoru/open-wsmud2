import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "衡阳西街";
    exits = {
        "east": "fb/hengshan2/hengyang",
        "north": "fb/hengshan2/liufumen",
    };
}
