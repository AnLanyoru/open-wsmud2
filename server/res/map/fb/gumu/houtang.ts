import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "后堂";
    desc = "这是后堂。";
    exits = {
        "west": "fb/gumu/qianting",
        "north": "fb/gumu/woshi",
        "east": "fb/gumu/qinshi",
    };
}
