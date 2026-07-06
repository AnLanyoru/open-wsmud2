import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "大厅";
    desc = "这是大厅。";
    exits = {
        "west": "fb/taohua/前院",
        "north": "fb/taohua/卧室",
        "east": "fb/taohua/书房",
    };
}
