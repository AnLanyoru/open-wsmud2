import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "赏雨亭";
    desc = "这是赏雨亭。";
    exits = {
        "east": "fb/cihang/xiaolu2",
    };
}
