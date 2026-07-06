import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "后山";
    desc = "这是后山。";
    exits = {
        "west": "fb/jingnian/白石广场",
    };
}
