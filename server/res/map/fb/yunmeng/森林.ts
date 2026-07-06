import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "森林";
    desc = "这是森林。";
    exits = {
        "east": "fb/yunmeng/云梦沼泽",
    };
}
