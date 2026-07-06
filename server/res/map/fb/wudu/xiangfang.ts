import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "厢房";
    desc = "这是厢房。";
    exits = {
        "east": "fb/wudu/nanyuan",
    };
}
