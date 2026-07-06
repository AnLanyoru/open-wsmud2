import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "小径";
    desc = "这是小径。";
    exits = {
        "west": "fb/yihua/lianhuachi",
        "east": "fb/yihua/midao2",
    };
}
