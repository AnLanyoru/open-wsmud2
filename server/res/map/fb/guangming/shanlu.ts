import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "山路";
    desc = "这是山路。";
    exits = {
        "east": "fb/guangming/zhandao",
        "northwest": "fb/guangming/banshanting",
    };
}
