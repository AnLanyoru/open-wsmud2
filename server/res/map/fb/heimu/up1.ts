import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "悬崖";
    desc = "这是悬崖。";
    exits = {
        "west": "fb/heimu/shulin",
        "north": "fb/heimu/up2",
    };
}
