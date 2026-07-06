import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "练武场";
    desc = "这是练武场。";
    exits = {
        "west": "fb/wudu/damen",
        "east": "fb/wudu/dating",
        "south": "fb/wudu/nanyuan",
    };
}
