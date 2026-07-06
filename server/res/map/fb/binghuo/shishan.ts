import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "石山";
    desc = "这是石山。";
    exits = {
        "south": "fb/binghuo/conglin2",
        "west": "fb/binghuo/shishan2",
    };
}
