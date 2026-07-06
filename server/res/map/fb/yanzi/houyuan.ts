import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "后院";
    desc = "这是后院。";
    exits = {
        "north": "fb/yanzi/tingyuju",
        "south": "fb/yanzi/yunjinlou",
    };
}
