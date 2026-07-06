import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "云梦沼泽";
    desc = "这是云梦沼泽。";
    exits = {
        "south": "fb/yunmeng/云梦沼泽",
        "east": "fb/yunmeng/云梦沼泽2",
        "north": "fb/yunmeng/云梦沼泽3",
    };
}
