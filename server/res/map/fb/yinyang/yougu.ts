import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "幽谷";
    desc = "这是幽谷。";
    exits = {
        "west": "fb/yinyang/hantan",
    };
}
