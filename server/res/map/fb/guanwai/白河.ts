import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "白河";
    desc = "这是白河。";
    exits = {
        "north": "fb/guanwai/小屋",
        "east": "fb/guanwai/密林",
        "west": "fb/guanwai/谷草跺",
    };
}
