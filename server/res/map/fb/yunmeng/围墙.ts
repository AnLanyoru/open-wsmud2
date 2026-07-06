import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "围墙";
    desc = "这是围墙。";
    exits = {
        "south": "fb/yunmeng/云梦沼泽2",
    };
}
