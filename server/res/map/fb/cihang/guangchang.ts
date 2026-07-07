import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "广场";
    exits = {
        "south": "fb/cihang/zhudian",
        "north": "fb/cihang/qichongmen",
        "west": "fb/cihang/xiaolu2",
        "east": "fb/cihang/xiaolu1",
    };
}
