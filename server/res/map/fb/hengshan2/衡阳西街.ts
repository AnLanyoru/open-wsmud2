import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "衡阳西街";
    desc = "这是衡阳西街。";
    exits = {
        "east": "fb/hengshan2/衡阳城",
        "north": "fb/hengshan2/刘府大门",
    };
}
