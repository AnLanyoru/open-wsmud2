import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "烈火期";
    desc = "这是烈火期。";
    exits = {
        "south": "fb/guangming/qi_hongshui",
        "west": "fb/guangming/lianwu",
        "east": "fb/guangming/duanya",
    };
}
