import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "庄门";
    exits = {
        "west": "fb/yanzi/hc1",
        "east": "fb/yanzi/qianyuan",
    };
}
