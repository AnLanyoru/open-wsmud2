import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "铜殿";
    desc = "这是铜殿。";
    exits = {
        "north": "fb/jingnian/铜殿内部",
    };
}
