import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "石山";
    desc = "这是石山。";
    exits = {
        "east": "fb/binghuo/shishan",
    };
}
