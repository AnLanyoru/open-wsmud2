import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "练武场";
    desc = "这是练武场。";
    exits = {
        "south": "fb/qingcheng/zoulang",
        "east": "fb/qingcheng/huayuan",
        "north": "fb/qingcheng/zhudian",
    };
}
