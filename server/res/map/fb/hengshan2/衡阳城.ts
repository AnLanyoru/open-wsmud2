import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "衡阳城";
    desc = "这是衡阳城。";
    exits = {
        "west": "fb/hengshan2/衡阳西街",
        "east": "fb/hengshan2/山路",
    };
}
