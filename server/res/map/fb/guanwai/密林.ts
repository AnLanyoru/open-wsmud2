import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "密林";
    desc = "这是密林。";
    exits = {
        "west": "fb/guanwai/白河",
    };
}
