import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "走廊";
    desc = "这是走廊。";
    exits = {
        "north": "fb/heimu/fl_ting",
        "south": "fb/heimu/fl_tang",
    };
}
