import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "小径";
    desc = "这是小径。";
    exits = {
        "north": "fb/yanzi/qianyuan",
        "east": "fb/yanzi/tingyuju",
    };
}
