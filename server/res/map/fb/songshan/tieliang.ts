import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "铁梁峡";
    desc = "这是铁梁峡。";
    exits = {
        "southwest": "fb/songshan/shandao",
    };
}
