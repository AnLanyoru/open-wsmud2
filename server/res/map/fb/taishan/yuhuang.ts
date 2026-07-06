import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "玉皇顶";
    desc = "这是玉皇顶。";
    exits = {
        "south": "fb/taishan/nantian",
    };
}
