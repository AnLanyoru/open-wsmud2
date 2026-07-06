import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "花园";
    desc = "这是花园。";
    exits = {
        "west": "fb/wudu/dating",
        "east": "fb/wudu/huating",
        "north": "fb/wudu/huayuan2",
    };
}
