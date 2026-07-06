import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "增长天王殿";
    desc = "这是增长天王殿。";
    exits = {
        "northeast": "fb/jingnian/主殿",
    };
}
