import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "古墓入口";
    desc = "这是古墓入口。";
    exits = {
        "east": "fb/gumu/qianting",
    };
}
