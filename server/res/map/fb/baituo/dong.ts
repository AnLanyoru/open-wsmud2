import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "石洞";
    desc = "这是石洞。";
    exits = {
        "south": "fb/baituo/zhulin",
    };
}
