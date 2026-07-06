import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "殿门";
    desc = "这是殿门。";
    exits = {
        "south": "fb/jingnian/石阶",
    };
}
