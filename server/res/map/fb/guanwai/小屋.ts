import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "小屋";
    desc = "这是小屋。";
    exits = {
        "south": "fb/guanwai/白河",
    };
}
