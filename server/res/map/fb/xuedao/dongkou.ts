import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "洞口";
    desc = "这是洞口。";
    exits = {
        "east": "fb/xuedao/xuedao",
    };
}
