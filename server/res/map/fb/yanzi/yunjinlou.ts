import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "云锦楼";
    desc = "这是云锦楼。";
    exits = {
        "north": "fb/yanzi/houyuan",
        "east": "fb/yanzi/xiaoting",
    };
}
