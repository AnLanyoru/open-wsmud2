import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "厚土旗";
    exits = {
        "south": "fb/guangming/guangmingding",
        "east": "fb/guangming/qi_hongshui",
        "west": "fb/guangming/qi_jumu",
        "north": "fb/guangming/lianwu",
    };
}
