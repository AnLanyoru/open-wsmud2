import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "黑风口";
    desc = "这是黑风口。";
    exits = {
        "east": "fb/guanwai/小天池",
    };
}
