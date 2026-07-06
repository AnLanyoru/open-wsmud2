import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "药房";
    desc = "这是药房。";
    exits = {
        "north": "fb/baituo/changlang",
    };
}
