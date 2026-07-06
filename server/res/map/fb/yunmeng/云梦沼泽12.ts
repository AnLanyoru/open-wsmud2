import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "云梦沼泽";
    desc = "这是云梦沼泽。";
    exits = {
        "west": "fb/yunmeng/云梦沼泽1",
        "north": "fb/yunmeng/围墙",
    };
}
