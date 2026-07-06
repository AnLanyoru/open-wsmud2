import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "练毒室";
    desc = "这是练毒室。";
    exits = {
        "north": "fb/wudu/nanyuan",
    };
}
