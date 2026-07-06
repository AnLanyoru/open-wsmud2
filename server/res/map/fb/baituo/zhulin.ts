import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "竹林";
    desc = "这是竹林。";
    exits = {
        "north": "fb/baituo/dong",
    };
}
