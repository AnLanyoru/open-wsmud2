import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "山谷";
    desc = "这是山谷。";
    exits = {
        "north": "fb/heimu/bh_tang",
        "south": "fb/heimu/ql_tang",
        "east": "fb/heimu/shulin",
    };
}
